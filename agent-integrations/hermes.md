# Hermes

[Hermes Agent](https://hermes-agent.nousresearch.com/docs) has a built-in MCP client —
no extra bridge needed.

## Setup

```bash
npm install -g playwright @playwright/mcp
playwright install chromium

hermes mcp add playwright \
  --connect-timeout 60 \
  --command "$(npm prefix -g)/bin/playwright-mcp" \
  --args --headless
```

- `--args --headless` — no visible browser window (headed is the default; drop the
  flag if you want to watch the browser work).
- `hermes mcp add` connects to the server, discovers the tools and writes the entry
  to `~/.hermes/config.yaml` (answer `Y` to enable all 25).
- **Start a new session** so Hermes picks the tools up (they appear as
  `mcp__playwright__browser_*`).

Verify:

```bash
hermes mcp test playwright   # ✓ Connected, ✓ Tools discovered: 25
hermes mcp list              # playwright | ... | ✓ enabled
```

Resulting config shape:

```yaml
mcp_servers:
  playwright:
    command: /Users/you/.local/bin/playwright-mcp
    args: ["--headless"]
    enabled: true
    timeout: 60
```

## Notes (learned in practice)

- Commands like `npm install -g` are flagged by Hermes's security scan. With
  `approvals.mode: smart`, the smart-approval guardian auto-approves them — but only
  if the guardian gets enough token budget. Symptom when it doesn't:
  `guardian returned an empty answer (finish_reason=length), escalating` in
  `~/.hermes/logs/agent.log`, and every flagged command then waits for a human.
  Fix:

  ```bash
  hermes config set auxiliary.approval.extra_body.max_tokens 256
  ```

- Trim the tool list any time: `hermes mcp configure playwright`.
