# pi

[pi](https://pi.dev) is a coding agent (`@earendil-works/pi-coding-agent`) with a
TypeScript extension system and no native MCP client. This integration adds a
native `browser` tool to every pi session.

## Setup

1. Machine setup (once): see [README.md](README.md) — global install + mcporter entry.

2. Drop the extension into pi's user extensions directory:

   ```bash
   mkdir -p ~/.pi/agent/extensions
   cp agent-integrations/pi/playwright.ts ~/.pi/agent/extensions/playwright.ts
   ```

That's it — pi loads `.ts` files from `~/.pi/agent/extensions` automatically in
interactive, print (‑p), JSON, and RPC modes.

## What you get

A `browser` tool with three actions:

| action | what it does |
|---|---|
| `open` | navigate to a URL → page title + readable text |
| `screenshot` | capture a PNG via the Playwright CLI → returns the file path |
| `script` | run your own `async (page) => …` through the Playwright MCP server |

## Verify (was run, 2026-09-25)

```bash
pi -p --no-session "У тебя есть инструмент browser. Вызови его: action=open, url=https://example.com — и верни заголовок страницы."
# → «Инструмент browser вызван успешно … Заголовок: "Example Domain"» ✓
```

## How it works

`playwright.ts` shells out to the system-wide Playwright:
- `open` / `script` → `mcporter call playwright-local.browser_run_code_unsafe code=…`
- `screenshot` → `playwright screenshot <url> <path>`

No MCP client inside pi is required — mcporter acts as the bridge.
