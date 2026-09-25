# Other clients

## VS Code

`~/Library/Application Support/Code/User/mcp.json` (macOS), section `"servers"`:

```json
"playwright": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest", "--headless"]
}
```

**Extension mode alternative** (used in our setup): add `"--extension"` instead of
`"--headless"` and set `PLAYWRIGHT_MCP_EXTENSION_TOKEN` in `env` — the agent then
drives your *already running* browser (keeps your logins) via the "Playwright MCP
Bridge" browser extension. The token is shown in the extension popup.

## Cursor

`~/.cursor/mcp.json`, section `"mcpServers"`:

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest", "--headless"]
}
```

Same `--extension` alternative applies (Cursor in our setup uses extension mode).

## pi

pi has no native MCP client. Two options:

1. **Shell out to the Playwright CLI** (quick jobs via the bash tool):

   ```bash
   playwright screenshot https://example.com shot.png
   ```

2. **Call the MCP server through mcporter** — register it once:

   ```bash
   mcporter config add playwright-local \
     --command "$(npm prefix -g)/bin/playwright-mcp" \
     --arg --headless --scope home
   ```

   then any agent (including pi via bash) can do:

   ```bash
   mcporter call playwright-local.browser_navigate url=https://example.com
   ```

   Notes (verified):
   - Plain `mcporter call` is one-shot — each call gets a fresh, isolated browser.
     For a durable session across calls run `mcporter daemon start` first; for a
     multi-step job in one call, pass a script:

     ```bash
     mcporter call playwright-local.browser_run_code_unsafe \
       code="async (page) => { await page.goto('https://example.com'); return await page.title(); }"
     # → "Example Domain"
     ```

## OpenClaude

`~/.openclaude/settings.json`, section `"mcpServers"`:

```json
"playwright": {
  "command": "playwright-mcp",
  "args": ["--headless"]
}
```

`playwright-mcp` must be on `PATH` (comes from `npm install -g @playwright/mcp`);
use the absolute path if OpenClaude does not inherit your shell environment.
