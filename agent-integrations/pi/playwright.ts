/**
 * Playwright browser tool for Pi.
 *
 * Adds a `browser` tool backed by the globally installed Playwright:
 *   - open:       navigate to a URL, return title + readable text
 *   - screenshot: capture a PNG via the Playwright CLI, return the file path
 *   - script:     run a custom Playwright script (async (page) => …) through
 *                 the local Playwright MCP server (mcporter → playwright-local)
 *
 * Setup (see agent-integrations in github.com/FreeAiHub/playwright):
 *   npm i -g playwright @playwright/mcp
 *   playwright install chromium
 *   mcporter config add playwright-local --command "$(npm prefix -g)/bin/playwright-mcp" --arg --headless --scope home
 *
 * Verified live 2026-09-25: `pi -p` → browser open example.com → "Example Domain".
 */

import { Type } from "@earendil-works/pi-ai";
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const MCPORTER = "/Users/investing/.local/bin/mcporter";
const PLAYWRIGHT = "/Users/investing/.local/bin/playwright";
const TIMEOUT_MS = 120_000;
const MAX_TEXT = 3000;

async function mcpScript(script: string): Promise<string> {
	const { stdout, stderr } = await run(
		MCPORTER,
		["call", "playwright-local.browser_run_code_unsafe", `code=${script}`],
		{ timeout: TIMEOUT_MS, maxBuffer: 4 * 1024 * 1024 },
	);
	return `${stdout || ""}${stderr ? `\n${stderr}` : ""}`.trim();
}

function clamp(text: string, limit = MAX_TEXT): string {
	return text.length > limit ? `${text.slice(0, limit)}\n… [truncated ${text.length - limit} chars]` : text;
}

const browserTool = defineTool({
	name: "browser",
	label: "Browser (Playwright)",
	description:
		"Drive a real headless Chromium via local Playwright. " +
		"Actions: `open` (URL → page title + readable text), " +
		"`screenshot` (URL → PNG file, returns its path), " +
		"`script` (custom `async (page) => …` Playwright script → its return value). " +
		"Use for checking web pages, local dev servers (http://localhost:…), scraping, or UI verification.",
	parameters: Type.Object({
		action: Type.Union([Type.Literal("open"), Type.Literal("screenshot"), Type.Literal("script")], {
			description: "What to do",
		}),
		url: Type.Optional(Type.String({ description: "Page URL (for open / screenshot)" })),
		script: Type.Optional(
			Type.String({
				description:
					"Playwright script for action=script: an async function expression, e.g. \"async (page) => { await page.goto('https://example.com'); return await page.title(); }\"",
			}),
		),
		path: Type.Optional(Type.String({ description: "PNG output path for screenshot (default: browser-shot-<ts>.png in cwd)" })),
	}),

	async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
		const cwd = ctx?.cwd || process.cwd();

		switch (params.action) {
			case "open": {
				if (!params.url) throw new Error("browser: `url` is required for action=open");
				const script =
					`async (page) => { await page.goto(${JSON.stringify(params.url)}); ` +
					`return { title: await page.title(), url: page.url(), ` +
					`text: (await page.locator('body').innerText()).slice(0, ${MAX_TEXT}) }; }`;
				const out = await mcpScript(script);
				return { content: [{ type: "text", text: clamp(out) }], details: { action: params.action, url: params.url } };
			}

			case "screenshot": {
				if (!params.url) throw new Error("browser: `url` is required for action=screenshot");
				const target = params.path || `browser-shot-${Date.now()}.png`;
				const abs = target.startsWith("/") ? target : `${cwd}/${target}`;
				await run(PLAYWRIGHT, ["screenshot", params.url, abs], { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 });
				return {
					content: [{ type: "text", text: `Screenshot saved: ${abs}` }],
					details: { action: params.action, url: params.url, path: abs },
				};
			}

			case "script": {
				if (!params.script) throw new Error("browser: `script` is required for action=script");
				const out = await mcpScript(params.script);
				return { content: [{ type: "text", text: clamp(out) }], details: { action: params.action } };
			}

			default:
				throw new Error(`browser: unknown action ${String(params.action)}`);
		}
	},
});

export default function (pi: ExtensionAPI) {
	pi.registerTool(browserTool);
}
