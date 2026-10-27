# Vellum help center — style guide

Every writing agent reads this before touching a page. It is the contract; the
section brief you were given adds scope, not exceptions.

## Who reads these docs

Staff at impact-measurement and advisory firms (analysts, advisors) and, for
some surfaces, their client organisations' members. They are not developers.
Never show code, SQL, internal route names, plan numbers, or repo paths.

## Voice

- Second person, plain English, short sentences. Warm, direct, like a helpful
  colleague. Sentence-case headings.
- British/Australian spelling: organisation, catalogue, colour, sign-off.
- NO em-dashes (—) or en-dashes (–) anywhere, including frontmatter and alt
  text. Use commas, colons, parentheses, or split the sentence. "to" for ranges.
- Exact UI labels in **bold**: click **New project**. Navigation paths as
  **Libraries → Factor library**. Keyboard keys as `Cmd+Z` in backticks (the
  one backtick exception).
- No emojis. No marketing superlatives. No "simply" or "just".

## Page anatomy (Mintlify MDX)

- Frontmatter: `title` (a name, 2-4 words), `description` (one plain sentence),
  and `icon` on section overview pages only (a lucide icon name).
- No H1 in the body; the title renders as the heading. Body starts with one or
  two sentences on what the feature is for, then a screenshot when the page
  describes a screen.
- `<Steps><Step title="...">` for every how-to task sequence.
- Tables for statuses, fields, columns, roles. Explanations in prose, not
  crammed into cells.
- `<Note>` for permission requirements ("You need the admin role...").
- `<Warning>` for irreversible or destructive actions.
- `<Tip>` sparingly for genuinely useful shortcuts.
- End each page with a Related section: `<CardGroup cols={2}>` of 2-4 `<Card>`
  links to adjacent pages.
- Beware literal `{` `}` `<` `>` in prose: they break MDX. Write them in
  backticks or rephrase.

## Screenshots

- Use the shared helper: `/Users/davidprice/Apps/documentation/tools/shoot.mjs`
  (see its header comment). Set `VELLUM_SHOT_AGENT=<your-section>` so your
  login state file is your own. Base URL comes from `VELLUM_BASE_URL`.
- At least one screenshot per page; ideally one per meaningful step. Crop
  dialogs and panels with `selector` instead of shipping the whole viewport.
- File path: `images/<area>/<name>.jpg` where `<area>` is your section slug.
  Reference as `![alt](/images/<area>/<name>.jpg)` with a plain-English alt
  text (no dashes).
- LOOK at every image you take (Read the file). Retake any shot showing a
  spinner, skeleton, toast, error, empty state you didn't intend, or the wrong
  record. A screenshot that embarrasses the product is worse than none.
- The signed-in user is "Demo Advisor". All data is synthetic; organisation
  names end in "(Sample)" or are obviously fictitious. If you see a real-looking
  name that isn't part of the seeded demo set, stop and report it.

## Truthfulness

- Labels, statuses, permissions, validation messages come from the code
  (/Users/davidprice/Apps/vellum-flow/frontend) or from the live UI. Never
  invent a feature, menu item, or limit.
- Leave out anything unreachable, dev-only, or behind a disabled flag. If a
  surface is visibly a placeholder, either omit it or describe it honestly
  ("not available yet") when users will see it.
- When unsure of a fact (especially permissions, visibility, undo, deletion),
  check the code; if still unsure, list it in your reply under "unsure" rather
  than guessing.

## Safety on the demo instance

- The demo stack and database are shared by all agents. Read-only by default.
- You MAY create records needed to photograph a flow (give them clearly
  fictitious names). You may open any dialog, screenshot it, then **Cancel**.
- NEVER: delete seeded data, change firm-wide or library settings other pages
  depend on, publish report versions, or sign anything off, unless your brief
  explicitly assigns that flow to you.
- No real emails, no real organisation or person names, no uploading files
  containing anything but synthetic "SAMPLE" content.

## Coordination

- Write only inside your assigned folders plus `images/<your-area>/`. Never
  touch docs.json, index.mdx, STYLE-GUIDE.md, other sections' folders, or git.
- Cross-link using the planned site map paths from your brief (absolute paths,
  no .md/.mdx extension). Linking to a page another agent is writing is fine
  and expected.

## Reply format (what you report back)

1. Ordered nav JSON for your section: `{"group": "...", "pages": [...]}`.
2. Features you left out and why.
3. Links you made to pages outside your section.
4. Facts you were unsure of.
5. Product bugs or odd UI text you noticed.
6. Records or settings you created or changed on the demo instance.
