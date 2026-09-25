We run five agent clients against Playwright MCP on one macOS workstation: Hermes, Cursor, VS Code, pi (via a small stdio bridge) and DeepSeek Harness. Getting that stable took a few tries; picking a topology was the hard part. We'd like to suggest a short docs section about it.

What we landed on, for the record:

- IDE agents (Cursor, VS Code) use --extension, so they drive the browser the human is already logged into.
- One agent runs the server over stdio as its own private browser (--headless).
- Shell-based agents go through a tiny bridge; for one-shot jobs we keep every multi-step action inside a single browser_run_code_unsafe call, because a stdio server started per call gives a fresh browser each time.

Two gaps we think are worth a paragraph in the README:

1. The "several clients, one machine" story. The README documents --port, --shared-browser-context and the persistent-profile caveat ("can only be used by one browser instance at a time"), but those facts live in different sections, and someone setting up a fleet has to assemble the topology themselves. A short "Working with several agents" recipe would save future readers a chunk of setup time.
2. One-shot stdio clients. Tools like mcporter, or any CLI that spawns the server per call, get a new browser each time and lose page state between calls. We worked around it with the single-call pattern above and it works fine, but we only found it by reading the tool schema. One sentence in the docs would make it obvious.

Nothing to fix, the server behaved as documented in every case we hit. It's a docs request from the "agent fleet on a developer machine" side of your users, and we suspect we're not the only ones setting this up. If you'd prefer a PR for that section, we're happy to draft one.
