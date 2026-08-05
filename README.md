# Vellum documentation

Customer-facing documentation for **Vellum**, the impact-measurement platform — built on [Mintlify](https://mintlify.com).

The guides cover the whole product: getting started, organisations, projects, the Workbench and valuations, the data room, the chat assistant, and the firm libraries (factors, methodologies, reporting methodologies, activities, beneficiaries, outcomes and surveys).

## Structure

- `index.mdx` — the documentation home page
- `product/` — one page per product area
- `product/libraries/` — one page per library
- `docs.json` — theme and navigation
- `AGENTS.md` — writing conventions for contributors (human or AI)

## Local preview

```bash
npx mint dev
```

Then open the local preview URL it prints. Pages are MDX with YAML frontmatter; navigation lives in `docs.json`.

## Writing conventions

Plain, warm language for a non-technical consultant audience. Sentence case headings, second person, bold UI labels, Australian English — see `AGENTS.md` for the full contract. Never document a dollar figure as something a person types: every number in Vellum is computed by the deterministic engine from sourced factors and measured client data.
