# DeepSeek Harness (DSH)

DSH boots profiles composed of plugin layers. MCP servers are added as
`@deepseek-ai/dsh-mcp-client` rows in the profile's `cordis.patch.yml`.

## Setup

1. Machine setup (once): see [README.md](README.md).

2. Install the MCP client plugin into the target profile (example: a web profile):

   ```bash
   dsh plugin --profile web add -w @deepseek-ai/dsh-mcp-client@0.1.5-rc.2
   ```

   (`-w` is required — the profile directory is a pnpm workspace root.)

3. Add the row to `~/.dsh/profiles/<profile>/cordis.patch.yml`:

   ```yaml
   - insert:
       - id: mcp-playwright
         name: '@deepseek-ai/dsh-mcp-client'
         config:
           serverName: playwright
           transport: stdio
           command: /usr/local/bin/node
           args:
             - /Users/you/.local/lib/node_modules/@playwright/mcp/cli.js
             - --headless
           failOnStartupError: false
           toolCallTimeoutMs: 180000
   ```

4. Restart the harness (rows load at startup). Verify the composition:

   ```bash
   dsh --profile web --dump-config | grep -A8 mcp-playwright
   ```

## Verify a live task (was run, 2026-09-25 — headless profile)

```bash
dsh --profile headless "Открой https://example.com браузерным инструментом mcp__playwright__browser_navigate и сообщи её заголовок."
# → «Заголовок страницы: «Example Domain»» — модель сама выбрала mcp__playwright__browser_navigate
#   и приложила вывод инструмента (Page Title: Example Domain) ✓
```

Tools appear as `mcp__playwright__*` — 25 of them: navigate, snapshot, click,
type, fill_form, tabs, console, network, evaluate, screenshots and more.

## Notes

- Schema cost is real: ~30 KB ≈ 7–8k tokens per request. If the value doesn't
  justify it, disable the row (`disabled: true`) or move it into a session
  preset — the same pattern used for `github` / `obsidian` rows.
- `playwright-mcp` runs its own headless Chromium — independent of any running
  browser; use it when you don't want to touch the logged-in browser (e.g.
  `chrome-devtools` rows that drive the user's Comet).
