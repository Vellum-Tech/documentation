# Vellum Documentation

Customer-facing documentation for [Vellum](https://vellum.com.au), the platform that turns an organisation's real-world evidence into audited, defensible impact reports.

Built with [Mintlify](https://mintlify.com). Content lives in MDX files; navigation, branding and theme are configured in `docs.json`.

## Structure

- `index.mdx` and `getting-started.mdx` cover orientation and first steps
- `guides/` covers the day-to-day product areas (organisations, projects, workbench and valuations, data room, chat assistant)
- `libraries/` covers the firm-wide reusable knowledge (factors, methodologies, reporting methodologies, activities, beneficiaries, outcomes, surveys)

## Local preview

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```
npm i -g mint
```

Then run this at the repo root, where `docs.json` lives:

```
mint dev
```

View the preview at `http://localhost:3000`.

## Publishing

Changes deploy automatically after pushing to `main`, via the Mintlify GitHub app. Install it from the [Mintlify dashboard](https://dashboard.mintlify.com/settings/organization/github-app) if it is not already connected.

## Troubleshooting

- If the dev environment will not start, run `mint update` to get the latest CLI.
- If a page loads as a 404, make sure you are running in the folder containing `docs.json`.
