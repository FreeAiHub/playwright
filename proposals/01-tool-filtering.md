We run Playwright MCP for five agent systems on a single workstation: Hermes, Cursor, VS Code, pi (through a small stdio bridge) and DeepSeek Harness. Each of them feeds the tool list into every model request, so the size of that list is a standing cost. We'd like a server-side way to publish a smaller list, and we have numbers for why.

Measured on v0.0.82 after initialize (raw minified tools/list, --headless): 25 tools, 19.6 KB. The five largest entries are browser_take_screenshot (1.6 KB), browser_emulate_media (1.2 KB), browser_fill_form (1.1 KB), browser_drop (1.1 KB) and browser_find (1.0 KB). A common subset for everyday browsing (navigate, snapshot, click, type, fill_form, wait_for, take_screenshot, close) comes to 6.7 KB, so filtering can cut about two thirds of that payload for agents that don't need the full set.

The gap we keep hitting: filtering exists only on the client side. Some clients have allowlists, and we use them where they exist, but two of our five have no such setting, and server-side filtering is the only kind that holds for every client and every reconnect. That is also the security argument in the recent draft (#1770) about browser_run_code_unsafe and WebMCP. We're hitting the same missing knob from the cost side.

We know the topic came up before (#885), and the answer then was that limiting tools belongs to the client. We'd like to make the case that with agent fleets now being a normal way to run this server, a server-side filter is worth adding.

What we would use, in order of preference:

1. --include-tools a,b,c / --exclude-tools x,y,z, applied server-side: filtered tools disappear from tools/list, and calls to them are refused, so a client with a stale cached list still can't reach them.
2. A documented pattern for named subsets (read-only, interactive, full) if you later want the sets configurable from a file. Flags first; we don't need this on day one.
3. Optional: print the resulting schema size on startup (or behind --list-tools), so operators can see what their agents are paying for.

Happy to test a build and report back with our five-client setup if that helps. To reproduce the numbers: npx @playwright/mcp@0.0.82 --headless, then capture tools/list straight from stdio.
