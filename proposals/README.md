# Product proposals (upstream)

Improvement requests we filed with microsoft/playwright-mcp, from our own setup: five
agent clients (Hermes, Cursor, VS Code, pi, DeepSeek Harness) sharing one Playwright MCP
install on one workstation.

| # | Filed | Proposal | Status |
|---|-------|----------|--------|
| 1 | 2026-09-25 | [Server-side tool filtering (--include-tools / --exclude-tools)](https://github.com/microsoft/playwright-mcp/issues/1772) | open |
| 2 | 2026-09-25 | [Recommended setup for several agents sharing one Playwright MCP](https://github.com/microsoft/playwright-mcp/issues/1773) | open |

The submitted text sits next to this file: [01-tool-filtering.md](01-tool-filtering.md),
[02-multi-agent-setup.md](02-multi-agent-setup.md). The numbers in proposal 1 were measured
on v0.0.82 (25 tools, 19.6 KB raw tools/list; an eight-tool browsing subset comes to 6.7 KB).
