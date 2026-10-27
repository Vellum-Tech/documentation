# Vellum Help Center

End-user documentation for [Vellum](https://vellum.com.au), the impact
measurement and valuation platform: how advisory firms and their client
organisations use Organisations, Projects, the Workbench, reports and the
libraries.

Built with [Mintlify](https://mintlify.com). Content is MDX; navigation,
branding and theme live in `docs.json`. Screenshots are real captures of the
app running against a fully synthetic demo dataset (no customer data).

## Structure

- `index.mdx`, `get-started/` — welcome, quickstart, navigation, account
- `organisations/` — the client area: profiles, people, data room, lifecycle
- `projects/` — engagements: record, data room, Workbench, reports, publishing
- `libraries/` — the firm's governed knowledge: factors, formulas, policies and friends
- `chat/` — the built-in agent
- `admin/` — team management and the roles reference
- `glossary.mdx`, `faq.mdx`

## Working on the docs

- `STYLE-GUIDE.md` is the writing contract (voice, page anatomy, screenshot rules).
- `tools/shoot.mjs` retakes screenshots against a seeded local demo stack (see its header).
- `node tools/check.mjs` verifies nav/files/images/links/frontmatter before publishing.

## Local preview

```
npm i -g mint
mint dev
```

Run at the repo root (where `docs.json` lives); preview at `http://localhost:3000`.

## Publishing

Pushes to `main` deploy automatically via the Mintlify GitHub app.
