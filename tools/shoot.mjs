// Shared screenshot helper for the Vellum help-center build.
//
// Usage as a module (from any Node >= 20 script):
//   import { openPage, snap, closeAll } from '/Users/davidprice/Apps/documentation/tools/shoot.mjs'
//   const page = await openPage('/dashboard')
//   await snap(page, 'get-started/dashboard')               // full viewport
//   await snap(page, 'projects/new-dialog', { selector: '[role="dialog"]' })
//   await closeAll()
//
// Usage as a CLI (one-off full-viewport shot):
//   node tools/shoot.mjs /dashboard get-started/dashboard [css-selector]
//
// Conventions:
// - Images land at <docs>/images/<area>/<name>.jpg, 1440x900 viewport,
//   deviceScaleFactor 2, JPEG quality 88.
// - Sign-in uses a Clerk sign-in ticket minted with the secret from the app's
//   frontend/.env.local. The secret never leaves process memory here.
// - Each agent gets its own storage-state file, keyed by $VELLUM_SHOT_AGENT,
//   so parallel agents don't overwrite each other's sessions.
// - Base URL from $VELLUM_BASE_URL, default http://localhost:3000.

import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const APP = '/Users/davidprice/Apps/vellum-flow/frontend'
const DOCS = '/Users/davidprice/Apps/documentation'
const BASE = process.env.VELLUM_BASE_URL ?? 'http://localhost:3000'
const AGENT = process.env.VELLUM_SHOT_AGENT ?? 'main'
const STATE_DIR = process.env.VELLUM_STATE_DIR ?? '/tmp/vellum-shoot'
const DEFAULT_USER = 'user_3Jb0LQ5gc20icP95Nks5e1ThWIc' // e2e-preview@vellum.com.au, admin in demo DB

const require = createRequire(join(APP, 'package.json'))
const { chromium } = require('@playwright/test')

function clerkSecret() {
  const env = readFileSync(join(APP, '.env.local'), 'utf8')
  const m = env.match(/^CLERK_SECRET_KEY=["']?([^"'\n]+)/m)
  if (!m) throw new Error('CLERK_SECRET_KEY not found in frontend/.env.local')
  return m[1]
}

async function mintTicket(userId) {
  const res = await fetch('https://api.clerk.com/v1/sign_in_tokens', {
    method: 'POST',
    headers: { Authorization: `Bearer ${clerkSecret()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, expires_in_seconds: 600 }),
  })
  const body = await res.json()
  if (!body.token) throw new Error(`could not mint sign-in ticket: ${body.errors?.[0]?.long_message ?? res.status}`)
  return body.token
}

let browser = null
const contexts = new Map() // user -> { context, page }

async function getBrowser() {
  if (!browser) browser = await chromium.launch()
  return browser
}

/**
 * Open `path` as a signed-in user (default: the demo advisor). Reuses one page
 * per user. Storage state is cached per agent+user so later runs skip sign-in.
 */
export async function openPage(path, { user = DEFAULT_USER, waitFor } = {}) {
  let entry = contexts.get(user)
  if (!entry) {
    mkdirSync(STATE_DIR, { recursive: true })
    const stateFile = join(STATE_DIR, `state-${AGENT}-${user}.json`)
    const b = await getBrowser()
    const context = await b.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      storageState: existsSync(stateFile) ? stateFile : undefined,
    })
    const page = await context.newPage()
    entry = { context, page, stateFile, user }
    contexts.set(user, entry)

    // Are we already signed in from cached state?
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
    const signedIn = !page.url().includes('/sign-in')
    if (!signedIn) {
      const ticket = await mintTicket(user)
      await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => Boolean(window.Clerk?.loaded), { timeout: 30_000 })
      const status = await page.evaluate(async (t) => {
        const clerk = window.Clerk
        const attempt = await clerk.client.signIn.create({ strategy: 'ticket', ticket: t })
        await clerk.setActive({ session: attempt.createdSessionId })
        return attempt.status
      }, ticket)
      if (status !== 'complete') throw new Error(`Clerk sign-in ended "${status}"`)
      await page.waitForFunction(() => Boolean(window.Clerk?.user), { timeout: 15_000 })
      await context.storageState({ path: stateFile })
    }
  }
  const url = path.startsWith('http') ? path : `${BASE}${path}`
  if (entry.page.url() !== url) await entry.page.goto(url, { waitUntil: 'networkidle' })
  if (waitFor) await entry.page.waitForSelector(waitFor, { timeout: 15_000 })
  // Let fonts/transitions settle.
  await entry.page.waitForTimeout(600)
  return entry.page
}

/**
 * Write <docs>/images/<slug>.jpg from `page`. Options:
 *   selector  — crop to the first matching element (dialog, panel)
 *   fullPage  — capture the full scroll height
 */
export async function snap(page, slug, { selector, fullPage = false } = {}) {
  const file = join(DOCS, 'images', `${slug}.jpg`)
  mkdirSync(dirname(file), { recursive: true })
  if (selector) {
    const el = page.locator(selector).first()
    await el.waitFor({ state: 'visible', timeout: 10_000 })
    await el.screenshot({ path: file, type: 'jpeg', quality: 88 })
  } else {
    await page.screenshot({ path: file, type: 'jpeg', quality: 88, fullPage })
  }
  return file
}

export async function closeAll() {
  for (const { context } of contexts.values()) await context.close().catch(() => {})
  contexts.clear()
  if (browser) await browser.close().catch(() => {})
  browser = null
}

// ---- CLI mode ----
const isCli = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isCli && process.argv[2]) {
  const [, , path, slug, selector] = process.argv
  const page = await openPage(path)
  const file = await snap(page, slug, selector ? { selector } : {})
  console.log(file)
  await closeAll()
}
