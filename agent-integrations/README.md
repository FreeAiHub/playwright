# Agent Integrations

Playwright as browser automation for AI coding agents — verified setup for
**Hermes**, **Cursor**, **VS Code**, **pi**, **OpenClaude** (and any other MCP-capable client).

Maintained in the [FreeAiHub/playwright](https://github.com/FreeAiHub/playwright) fork;
the fork mirrors [microsoft/playwright](https://github.com/microsoft/playwright).

## Install (once per machine)

```bash
npm install -g playwright @playwright/mcp   # global — every project and agent gets it
playwright install chromium                 # browser binaries
```

Verify:

```bash
playwright --version        # e.g. 1.63.0
playwright-mcp --version    # e.g. 0.0.82
```

## Wire into your agent

| Client | Guide | Transport |
|---|---|---|
| Hermes | [hermes.md](hermes.md) | stdio (global binary), headless |
| VS Code | [other-clients.md](other-clients.md#vs-code) | stdio via `mcp.json` |
| Cursor | [other-clients.md](other-clients.md#cursor) | stdio via `mcp.json` |
| pi | [other-clients.md](other-clients.md#pi) | via mcporter / shell |
| OpenClaude | [other-clients.md](other-clients.md#openclaude) | stdio via `settings.json` |

The server exposes 25 tools: navigation, accessibility snapshots, click / type /
fill / select, tabs, console messages, network requests, JavaScript evaluation,
file upload, screenshots and more.

## Check it works

[verify.md](verify.md) — a five-minute end-to-end check.

---

Setup verified on macOS, September 2026 — Node 26, `playwright` 1.63.0, `@playwright/mcp` 0.0.82.
