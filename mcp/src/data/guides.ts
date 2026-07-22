import type { Guide } from '../types.js';

/**
 * Curated knowledge base served by the authoring-guide tool. Each guide is a
 * self-contained markdown section; `topic` selects one, and an omitted topic
 * returns the workflow plus an index of the rest.
 */
export const guides: readonly Guide[] = [
  {
    id: 'overview',
    title: 'What this addon does',
    keywords: ['overview', 'intro', 'what', 'purpose', 'visual', 'regression'],
    body: `# storybook-addon-playwright — visual/screenshot regression testing

This addon drives Storybook stories with Playwright to capture screenshots and
diff them against saved baselines, across chromium / firefox / webkit.

You author screenshot definitions as JSON **action files** that live next to each
story file. Each definition is a sequence of **actions** (click, hover, fill,
wait, …) ending in a **screenshot** action. The addon runs those actions in a
real browser and stores the resulting image so future runs can detect visual
regressions.

## Fast path — do exactly this

For "add a screenshot / visual test for this story", you can usually finish
without reading other files or running any commands:

1. **Read the target \`*.stories.tsx\`.** Note the meta \`title\` and each exported
   story name.
2. **Derive each story id** = \`kebab(title) + "--" + kebab(exportName)\`. This is
   the \`?id=\` value in the Storybook URL. (title \`Forms/Input\`, export
   \`WithPrefix\` → \`forms-input--withprefix\`.)
3. **Pick a stable selector** for the element to capture — \`[data-slot="…"]\`,
   \`[data-testid="…"]\`, then \`#id\` (see \`selectors\`). The story's own wrapper /
   decorator id is a fine target for a whole-component shot.
4. **Write \`<StoryBase>.stories.playwright.json\`** next to the story (create it,
   or merge into it if present). Copy the shape below; one screenshot per story,
   ending in \`takeElementScreenshot\`. That is the deliverable.
5. **Generating the baseline image is a separate, human/CI step — see below.**

Minimal action file (copy this, don't go read other \`.playwright.json\` files):

\`\`\`json
{
  "version": "0",
  "stories": {
    "forms-input--default": {
      "screenshots": [
        {
          "id": "scDefault01",
          "index": 0,
          "title": "Default input",
          "browserType": "chromium",
          "browserOptionsId": "vp1",
          "actionSets": [
            {
              "id": "set1",
              "title": "capture",
              "actions": [
                { "id": "a1", "name": "takeElementScreenshot",
                  "args": { "selector": "[data-slot=\\"input\\"]" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "browserOptions": { "vp1": { "viewport": { "width": 480, "height": 200 } } },
  "screenshotOptions": {}
}
\`\`\`

## Generating the image

Writing the JSON does not itself create the PNG. Baselines are produced only
while the **Storybook dev server is running with this addon** (that is where the
browser and config live). Once the JSON is authored, generate them with the CLI:

\`\`\`
npx storybook-addon-playwright generate <file.stories.playwright.json>
# one story only:  --story <storyId>      custom origin:  --url http://localhost:6006
\`\`\`

It reads the file, renders each screenshot against the running Storybook, and
writes any missing baseline PNGs (first-run baselines).

**If it prints "Storybook is not reachable"**, that is expected when the dev
server is not running — it is **not** an error to debug. Do **not** try to start
Storybook, hunt for a script, or retry. Just relay the manual steps it prints:
start Storybook (\`npm run storybook\`), open the story, and Save in the addon
panel. Then stop.

Do **not** spend turns running \`ls\` / \`grep\` / test commands to find some other
generation path — the CLI above (or the addon panel) is the whole story. See the
\`endpoint\` topic for the underlying tRPC call it makes.

---

See topics: \`conventions\`, \`workflow\`, \`selectors\`, \`screenshots\`, \`file-format\`,
\`browser-options\`, \`screenshot-options\`, \`endpoint\`, \`example\`. Use the
\`search_playwright_actions\` / \`get_playwright_action\` tools for the action
catalog. For most requests the fast path above plus \`selectors\` is enough — only
open other topics when you need interactions, dark mode, or non-default output.`,
  },
  {
    id: 'conventions',
    title: 'File naming & location',
    keywords: ['naming', 'file', 'location', 'folder', 'convention', 'where', 'filename'],
    body: `# File naming & location

- The action file **must sit in the same folder as its story file**.
- It **must share the story file's base name**, with \`.playwright.json\` in place
  of the story extension:
  - \`Button.stories.tsx\`  →  \`Button.stories.playwright.json\`
  - \`AlertToast.stories.tsx\`  →  \`AlertToast.stories.playwright.json\`
- One action file covers **all stories exported from that story file**; each
  story is keyed by its Storybook story id inside the \`stories\` object.
- Generated baseline images are stored in a \`__screenshots__\` folder next to the
  story file. You do not write those by hand — they are produced when the
  screenshot is generated.

If the action file does not already exist, create it. If it exists, merge your
new screenshot into the correct story entry rather than overwriting it.`,
  },
  {
    id: 'file-format',
    title: 'Action file JSON structure',
    keywords: ['format', 'schema', 'structure', 'json', 'shape', 'fields', 'storyid'],
    body: `# Action file JSON structure

\`\`\`jsonc
{
  "version": "0",
  "stories": {
    // Key = Storybook story id: "<kebab-title>--<kebab-export>".
    // It is the id in the Storybook URL (?id=...). Example:
    //   title "Components/AlertToast" + export "Default"
    //   -> "components-alerttoast--default"
    "components-button--default": {
      "screenshots": [
        {
          "id": "unique-id-1",           // unique string (nanoid-style, ~12 chars)
          "index": 0,                     // order within the story
          "title": "Button hover state",  // human-readable description
          "browserType": "chromium",      // chromium | firefox | webkit
          "browserOptionsId": "vp-1",     // OPTIONAL, references browserOptions below
          "globals": { "backgrounds": { "grid": false } }, // OPTIONAL Storybook globals
          "actionSets": [ /* see below */ ]
        }
      ]
    }
  },
  "browserOptions": {
    "vp-1": { "viewport": { "width": 622, "height": 275 }, "cursor": true }
  },
  "screenshotOptions": {}
}
\`\`\`

**actionSets** — an ordered list of groups; every action across all sets runs in
order. Each set:

\`\`\`jsonc
{ "id": "set-1", "title": "click then capture", "actions": [ /* actions */ ] }
\`\`\`

**action** — one operation. \`args\` matches the action (see the action catalog):

\`\`\`jsonc
{ "id": "act-1", "name": "click", "args": { "selector": "#submit" } }
\`\`\`

Notes:
- \`id\` fields must be unique short strings; any unique alphanumeric id works.
- A screenshot definition should **end with a screenshot action** (usually
  \`takeElementScreenshot\`); everything before it puts the component in the
  desired state.
- \`viewport\` (via \`browserOptions\`) keeps captures deterministic. Set
  \`"cursor": true\` only if you need the fake cursor visible in the image.

See the \`browser-options\` topic for \`browserOptions\` (viewport, color scheme,
device emulation) and the \`screenshot-options\` topic for \`screenshotOptions\`
(png/jpeg, clip, fullPage).`,
  },
  {
    id: 'workflow',
    title: 'Step-by-step authoring workflow',
    keywords: ['workflow', 'steps', 'how', 'add', 'create', 'generate', 'process'],
    body: `# Step-by-step: add a story screenshot / visual test

1. **Find the story.** Locate the \`*.stories.tsx\` file and the specific export
   (story) the user wants to test. Derive its story id
   (\`<kebab-title>--<kebab-export>\`).
2. **Inspect the component markup** to find a stable selector for the element to
   capture and for any elements you must interact with first. Prefer
   \`data-slot\`, \`data-testid\`, or \`id\` (see the \`selectors\` topic). If the
   component lacks a stable hook, add a \`data-testid\` to the component source.
3. **Decide the interaction.** List the actions needed to reach the target state
   (e.g. click a trigger, wait for a toast). Keep it minimal.
4. **Write the action file** (\`<StoryBase>.stories.playwright.json\`) next to the
   story, keyed by story id. End the action set with \`takeElementScreenshot\` on
   the focused element. Use \`options.offset\` to trim unwanted edges.
5. **Choose a viewport** via \`browserOptions\` so the capture is deterministic and
   small.
6. **Generate the baseline.** Run
   \`npx storybook-addon-playwright generate <file.stories.playwright.json>\`
   (add \`--story <storyId>\` for one story). It needs the Storybook dev server
   running with this addon. If it reports Storybook is not reachable, relay the
   manual steps it prints (start Storybook, Save in the addon panel) and stop —
   do not try to start Storybook or search for another path. See \`endpoint\`.
7. **Verify** (once an image exists) it is focused on the component and reasonably
   small; adjust selector/offset/viewport if it includes unwanted chrome.

Prefer waiting on a selector over fixed timeouts, and prefer a focused element
screenshot over a full-page one — smaller images diff faster and flake less.`,
  },
  {
    id: 'selectors',
    title: 'Selector strategy',
    keywords: [
      'selector',
      'data-slot',
      'data-testid',
      'id',
      'element',
      'target',
      'stable',
    ],
    body: `# Selector strategy

When targeting an element — both for interactions and for
\`takeElementScreenshot\` — use a **stable** selector, in this order of
preference:

1. \`[data-slot="..."]\` — semantic slot hooks (common in shadcn-style components).
2. \`[data-testid="..."]\` — explicit test hooks.
3. \`#id\` — a stable element id.

Avoid brittle selectors: tag/nth-child chains, generated class names, or text
that changes with copy/locale.

If the component you need to interact with or screenshot has **no** stable hook,
add one to the component source (e.g. \`data-testid="..."\` or a \`data-slot\`)
and then reference it. This keeps the visual test resilient to markup changes.

Perform interactions against the element that owns the behavior via these
attributes (e.g. click the \`[data-slot="trigger"]\`, then screenshot the
\`[data-slot="content"]\`).`,
  },
  {
    id: 'screenshots',
    title: 'Screenshot sizing & focus',
    keywords: [
      'screenshot',
      'size',
      'focus',
      'offset',
      'crop',
      'element',
      'full page',
      'small',
    ],
    body: `# Screenshot sizing & focus

- **Prefer focused element screenshots.** For component testing, use
  \`takeElementScreenshot\` on the component (or the exact sub-element) instead of
  a full-page/viewport screenshot. Full-page images are large, so full diff
  runs get much slower and more prone to noise.
- **Use \`options.offset\`** on \`takeElementScreenshot\` to tighten the capture:
  - positive number → crops inward on every side (drops focus rings, drop
    shadows, or outer margins you do not want in the baseline);
  - negative number → expands outward to include a little surrounding context.
  \`\`\`json
  { "name": "takeElementScreenshot",
    "args": { "selector": "[data-slot=\\"alert\\"]", "options": { "offset": 4 } } }
  \`\`\`
- **Pin a viewport** via \`browserOptions\` so layout is deterministic.
- Put the screenshot action **last**, after the component reaches the state you
  want to record.
- Only use \`takeScreenshot\` / \`takeScreenshotAll\` (viewport shots) when you
  specifically need to record a multi-step flow or full layout.`,
  },
  {
    id: 'browser-options',
    title: 'browserOptions (viewport, color scheme, …)',
    keywords: [
      'browseroptions',
      'browser',
      'viewport',
      'cursor',
      'darkmode',
      'colorscheme',
      'device',
      'mobile',
      'touch',
      'locale',
      'size',
    ],
    body: `# browserOptions

\`browserOptions\` is a map at the top of the action file, keyed by id. A
screenshot references one entry via \`browserOptionsId\`:

\`\`\`jsonc
{
  "stories": {
    "components-button--default": {
      "screenshots": [
        { "id": "s1", "title": "…", "browserType": "chromium",
          "browserOptionsId": "vp-1", "actionSets": [ /* … */ ] }
      ]
    }
  },
  "browserOptions": {
    "vp-1": { "viewport": { "width": 400, "height": 200 }, "cursor": false }
  }
}
\`\`\`

Each entry is a Playwright **BrowserContextOptions** object plus two addon
extras. The options most relevant to visual testing:

| Option | Type | Why it matters |
| --- | --- | --- |
| \`viewport\` | \`{ width, height }\` | **Pin it.** A fixed, tight viewport keeps captures deterministic and small — the single biggest lever on diff speed/stability. |
| \`cursor\` | \`boolean\` (addon extra) | Renders the fake mouse cursor into the image. Enable only when the cursor position is part of what you are testing. |
| \`deviceScaleFactor\` | \`number\` | Pixel density; raise for retina-like captures (also raises image size). |
| \`colorScheme\` | \`"light" \| "dark" \| "no-preference"\` | Test dark mode. |
| \`reducedMotion\` | \`"reduce" \| "no-preference"\` | Freeze animations for stable shots. |
| \`forcedColors\` | \`"active" \| "none"\` | High-contrast mode. |
| \`hasTouch\` / \`isMobile\` | \`boolean\` | Required for touch actions / mobile emulation. |
| \`locale\`, \`timezoneId\` | \`string\` | Deterministic locale/time-dependent UI. |

Any other Playwright BrowserContextOptions key is also accepted. A screenshot may
instead carry an inline \`browserOptions\` object directly, but the file
convention is the shared \`browserOptions\` map + \`browserOptionsId\` so viewports
can be reused across screenshots.`,
  },
  {
    id: 'screenshot-options',
    title: 'screenshotOptions (png/jpeg, clip, fullPage, …)',
    keywords: [
      'screenshotoptions',
      'png',
      'jpeg',
      'quality',
      'clip',
      'fullpage',
      'omitbackground',
      'transparency',
      'format',
    ],
    body: `# screenshotOptions

\`screenshotOptions\` is a map at the top of the action file, keyed by id. A
screenshot references one entry via \`screenshotOptionsId\`. These are Playwright
**ScreenshotOptions** applied when the image is captured:

| Option | Type | Notes |
| --- | --- | --- |
| \`type\` | \`"png" \| "jpeg"\` | Defaults to \`png\`. Use \`jpeg\` + \`quality\` to shrink baselines when pixel-exactness is not required. |
| \`quality\` | \`number\` (0–100) | \`jpeg\` only. |
| \`fullPage\` | \`boolean\` | Captures the whole scrollable page. **Avoid for component tests** — large and slow to diff. |
| \`clip\` | \`{ x, y, width, height }\` | Capture a fixed rectangle. Rarely needed: \`takeElementScreenshot\` already crops to an element, and its \`options.offset\` trims edges. |
| \`omitBackground\` | \`boolean\` | Transparent background (png only). |
| \`timeout\` | \`number\` | Max ms for the capture. |

\`\`\`jsonc
{
  "screenshotOptions": {
    "opt-1": { "type": "jpeg", "quality": 80 }
  },
  "stories": {
    "components-button--default": {
      "screenshots": [
        { "id": "s1", "title": "…", "browserType": "chromium",
          "screenshotOptionsId": "opt-1", "actionSets": [ /* … */ ] }
      ]
    }
  }
}
\`\`\`

**Do not confuse this with the \`takeScreenshotOptions\` _action_.** This
file-level \`screenshotOptions\` map controls *how each image is captured*
(format/clip/…); the \`takeScreenshotOptions\` action controls *how multiple
\`takeScreenshot\` images are merged* (stitch vs overlay).`,
  },
  {
    id: 'endpoint',
    title: 'Generating images (endpoint)',
    keywords: ['endpoint', 'generate', 'trpc', 'take', 'save', 'run', 'server', 'api'],
    body: `# Generating the screenshots

**All generation requires a running Storybook dev server with this addon loaded**
— that process owns the browser and config. There is no way to render baselines
from nothing, so never hunt for a build/test script when Storybook is down.

## Preferred: the \`generate\` CLI

After authoring the JSON, run:

\`\`\`
npx storybook-addon-playwright generate <file.stories.playwright.json>
#   --story <storyId>   only that story      --url <origin>   default http://localhost:6006
\`\`\`

It POSTs to the running Storybook, renders each screenshot, and writes missing
baseline PNGs (first-run baselines). If it reports **"Storybook is not
reachable"**, that is the normal not-running state — relay its manual steps
(start Storybook, Save in the addon panel) and stop; do not retry or start
Storybook yourself.

## Underlying tRPC endpoint

The CLI calls a local tRPC endpoint mounted while Storybook dev runs:

\`\`\`
POST {storybookOrigin}/__storybook_playwright/trpc/<procedure>
\`\`\`

Requests are **plain JSON (no superjson transformer)**. Non-batched, a mutation's
body is the raw input and the response is \`{ "result": { "data": … } }\`.
Relevant procedures (see \`src/api/trpc/routers/screenshot.router.ts\`):

- \`screenshot.testScreenshots\` — what \`generate\` uses. Reads the authored
  \`*.playwright.json\`, renders each screenshot, and **writes the baseline on
  first run** (results are marked \`added\`). Input:
  \`\`\`json
  { "filePath": "…/Button.stories.playwright.json",
    "storyId": "components-button--default",
    "requestType": "file" }
  \`\`\`
  (\`requestType\`: \`"file"\` = whole file, \`"story"\` = just \`storyId\`, \`"all"\` =
  every \`*.playwright.json\`.) \`filePath\` must be **relative to the Storybook
  project root** (its cwd) so the server matches it.
- \`screenshot.takeScreenshot\` — renders and returns base64 only, no persist.
- \`screenshot.saveScreenshot\` — persists a passed \`base64\` to
  \`__screenshots__\` **and** records the entry in the JSON; used by the addon
  panel's take→save flow.

Other ways to generate the same baselines: the **addon panel** (build shot →
Save), or the project's **visual-test suite** (\`toMatchScreenshots\` /
\`runImageDiff\`), which also writes baselines on first run.`,
  },
];
