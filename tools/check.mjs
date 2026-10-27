// Consistency checks for the help center. Run: node tools/check.mjs
// Verifies nav <-> files <-> images <-> usage, frontmatter, and style rules.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const DOCS = '/Users/davidprice/Apps/documentation'
const problems = []
const warn = (m) => problems.push(m)

// --- collect nav pages from docs.json
const docs = JSON.parse(readFileSync(join(DOCS, 'docs.json'), 'utf8'))
const navPages = []
const walk = (node) => {
  if (Array.isArray(node)) return node.forEach(walk)
  if (node && typeof node === 'object') {
    if (Array.isArray(node.pages)) node.pages.forEach((p) => (typeof p === 'string' ? navPages.push(p) : walk(p)))
    for (const [k, v] of Object.entries(node)) if (k !== 'pages') walk(v)
  }
}
walk(docs.navigation)

// --- collect mdx files
const mdxFiles = []
const scan = (dir) => {
  for (const e of readdirSync(dir)) {
    if (['node_modules', '.git', 'tools', 'plans', 'logo', 'images'].includes(e)) continue
    const p = join(dir, e)
    const s = statSync(p)
    if (s.isDirectory()) scan(p)
    else if (e.endsWith('.mdx')) mdxFiles.push(relative(DOCS, p).replace(/\.mdx$/, ''))
  }
}
scan(DOCS)

// --- nav vs files
for (const p of navPages) if (!existsSync(join(DOCS, `${p}.mdx`))) warn(`NAV ENTRY WITHOUT FILE: ${p}`)
for (const f of mdxFiles) if (!navPages.includes(f)) warn(`FILE NOT IN NAV: ${f}`)
const dupes = navPages.filter((p, i) => navPages.indexOf(p) !== i)
for (const d of [...new Set(dupes)]) warn(`DUPLICATE NAV ENTRY: ${d}`)

// --- images on disk
const imagesOnDisk = []
const scanImg = (dir) => {
  if (!existsSync(dir)) return
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) { if (e !== '_smoke') scanImg(p) }
    else imagesOnDisk.push('/' + relative(DOCS, p))
  }
}
scanImg(join(DOCS, 'images'))

// --- per-file checks
const referencedImages = new Set()
for (const f of mdxFiles) {
  const body = readFileSync(join(DOCS, `${f}.mdx`), 'utf8')
  if (!/^---\n[\s\S]*?\btitle:/m.test(body)) warn(`MISSING TITLE FRONTMATTER: ${f}`)
  if (!/^---\n[\s\S]*?\bdescription:/m.test(body)) warn(`MISSING DESCRIPTION: ${f}`)
  if (/[—–]/.test(body)) warn(`EM/EN DASH in ${f}: ${(body.match(/[—–]/g) || []).length}x`)
  for (const m of body.matchAll(/!\[[^\]]*\]\((\/images\/[^)\s]+)\)|src="(\/images\/[^"]+)"/g)) {
    const img = m[1] ?? m[2]
    referencedImages.add(img)
    if (!existsSync(join(DOCS, img))) warn(`BROKEN IMAGE REF in ${f}: ${img}`)
  }
  for (const m of body.matchAll(/\]\((\/[a-z0-9/-]+)(?:#[^)]*)?\)/g)) {
    const target = m[1]
    if (target.startsWith('/images/')) continue
    if (target === '/') continue
    if (!existsSync(join(DOCS, `${target.slice(1)}.mdx`)) && !existsSync(join(DOCS, target.slice(1), 'index.mdx')))
      warn(`BROKEN INTERNAL LINK in ${f}: ${target}`)
  }
  for (const m of body.matchAll(/(sk_live|sk_test|pk_live|AKIA[0-9A-Z]{16}|BEGIN [A-Z]+ PRIVATE KEY)/g))
    warn(`POSSIBLE SECRET in ${f}: ${m[1]}`)
}
for (const img of imagesOnDisk) if (!referencedImages.has(img)) warn(`UNUSED IMAGE: ${img}`)

console.log(`nav pages: ${navPages.length}  mdx files: ${mdxFiles.length}  images: ${imagesOnDisk.length}  referenced: ${referencedImages.size}`)
if (problems.length) { console.log(`\n${problems.length} problem(s):`); for (const p of problems) console.log('  - ' + p); process.exitCode = 1 }
else console.log('all checks passed')
