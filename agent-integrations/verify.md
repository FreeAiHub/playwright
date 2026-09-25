# Verify the setup

Five minutes, end to end. All four steps below passed on macOS on 2026-09-25.

## 1. Versions

```bash
playwright --version        # → Version 1.63.0
playwright-mcp --version    # → 0.0.82
```

## 2. Browser smoke test (Playwright CLI)

```bash
playwright screenshot https://github.com/FreeAiHub/playwright /tmp/pw-test.png
ls -la /tmp/pw-test.png     # non-empty file → browser stack works
```

## 3. MCP handshake

```bash
hermes mcp test playwright  # → ✓ Connected, ✓ Tools discovered: 25
```

or, for any MCP config mcporter can see:

```bash
mcporter list playwright-local --schema
```

## 4. Real MCP tool call (a browser action through the MCP server)

```bash
mcporter config add playwright-local \
  --command "$(npm prefix -g)/bin/playwright-mcp" \
  --arg --headless --scope home

mcporter call playwright-local.browser_navigate url=https://github.com/FreeAiHub/playwright
# → Page Title: GitHub - FreeAiHub/playwright: Playwright is a framework for Web Testing…

# multi-step in a single call (each plain call is a fresh browser):
mcporter call playwright-local.browser_run_code_unsafe \
  code="async (page) => { await page.goto('https://example.com'); return await page.title(); }"
# → "Example Domain"
```

If you get a page title back, the whole chain (agent → MCP → browser) is live.
