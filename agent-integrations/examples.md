# Examples (all verified, 2026-09-25)

Run through the MCP server. Hermes keeps a persistent session; shell users can go
via mcporter (see [other-clients.md](other-clients.md)).

## 1. Interaction — type, click, verify

Demo target: the official Playwright TodoMVC app.

```bash
mcporter call playwright-local.browser_run_code_unsafe \
  code="async (page) => { await page.goto('https://demo.playwright.dev/todomvc'); await page.locator('.new-todo').fill('Check Hermes MCP'); await page.keyboard.press('Enter'); await page.locator('.new-todo').fill('Second item'); await page.keyboard.press('Enter'); await page.locator('.todo-list li').first().locator('.toggle').click(); return { items: await page.locator('.todo-list li').allTextContents(), done: await page.locator('.todo-list li.completed').count() }; }"
# → {"items":["Check Hermes MCP","Second item"],"done":1}
```

## 2. Data extraction from a live page

```bash
mcporter call playwright-local.browser_run_code_unsafe \
  code="async (page) => { await page.goto('https://news.ycombinator.com'); return { title: await page.title(), headline: await page.locator('.titleline a').first().textContent() }; }"
# → {"title":"Hacker News","headline":"Platform-Independent SIMD in Go"}
```

## 3. Screenshot of any page (CLI, one step)

```bash
playwright screenshot https://github.com/FreeAiHub/playwright/tree/agent-integrations branch.png
# → branch.png (100 KB)
```
