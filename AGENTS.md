> **First-time setup**: Customize this file for your project. Prompt the user to customize this file for their project.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP

## Terminology

- Use **organisation**, not "client" or "customer", for the entities being measured (Australian spelling).
- A **project** is one measurement engagement for one reporting period.
- An **operand** is a named, unit-labelled input slot on a methodology — it never carries a value.
- A **factor** is a sourced reference value with a citation and version history.
- **Quantified outputs** are the organisation's own measured evidence (the schema's "client metrics" — never use that phrase in docs).
- A **reporting methodology** (SROI, CBA, …) is the report-level protocol chosen per project; a **methodology** is a valuation formula. Don't conflate them.
- The **golden rule**: no person ever types a dollar figure onto a report — the deterministic engine computes every number. State it, don't soften it.

## Style preferences

{/* Add any project-specific style rules below */}

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

## Content boundaries

{/* Define what should and shouldn't be documented */}
{/* Example: Don't document internal admin features */}
