<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Writing standard

Use the repository rules in [`STYLE_GUIDE.md`](STYLE_GUIDE.md) for current UI
copy, documentation, and user-facing messages. Write in English (US) with a
professional, conversational, and engaging tone. Prefer active voice, concise
sentences, specific verbs, consistent terminology, and a final proofreading pass.
Avoid hype, filler, vague claims, and AI-patterned phrasing. Preserve technical
identifiers, workflow statuses, audit evidence, and COSO control language.

## Delivery standard

Before execution, review current official guidance for the tools and frameworks
in scope. Update every affected active document and guide after implementation so
the runtime boundary, deployment instructions, and validation record stay in
sync. Commit locally, then update the remote through authenticated `gh`; never
claim a check passed when its required runtime was unavailable.
