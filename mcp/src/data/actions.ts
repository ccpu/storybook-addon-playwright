import type { PlaywrightAction } from '../types.js';

/**
 * Curated catalog of actions supported inside a `*.stories.playwright.json`
 * action set. Every action object in a file has the shape
 * `{ "name": <name>, "args": { ... }, "id": <unique> }`.
 *
 * Standard Playwright `Page` actions (click, hover, fill, …) take the same
 * arguments as the Playwright API; only the addon-specific extras and the
 * screenshot actions are documented in full here.
 */
export const actions: readonly PlaywrightAction[] = [
  // ---------------------------------------------------------------------------
  // Screenshot actions (the ones that actually produce images)
  // ---------------------------------------------------------------------------
  {
    name: 'takeElementScreenshot',
    category: 'screenshot',
    description:
      'Captures a screenshot cropped to the element matching `selector`. This is the PREFERRED way to screenshot a component — a focused capture keeps the image small, which makes visual diff testing much faster and more stable.',
    capturesScreenshot: true,
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description:
          'CSS selector for the element to capture. Prefer stable hooks: `[data-slot="..."]`, `[data-testid="..."]` or `#id`.',
      },
      {
        name: 'options.timeout',
        type: 'number',
        description:
          'Max ms to wait for the selector to attach. Defaults to Playwright’s configured timeout (30s).',
      },
      {
        name: 'options.offset',
        type: 'number',
        description:
          'Inset in pixels applied to every side of the element’s bounding box before capture, for a more focused image. Positive crops inward (drops unwanted edges/margins); negative expands outward to include surrounding pixels. When set, the addon clips the page to the adjusted box instead of screenshotting the element handle.',
      },
    ],
    example: {
      name: 'takeElementScreenshot',
      args: { selector: '[data-slot="alert"]', options: { offset: 4 } },
    },
    notes: [
      'Place it as the LAST action once the component is in the desired state.',
      'Avoid full-page screenshots for component tests — they are large and slow to diff.',
      'Use `options.offset` to trim a focus ring, drop shadow, or outer margin you do not want in the baseline.',
    ],
    keywords: ['crop', 'element', 'focused', 'component', 'offset', 'baseline'],
  },
  {
    name: 'takeScreenshot',
    category: 'screenshot',
    description:
      'Captures a viewport screenshot at the current point in the action sequence. Useful for recording an intermediate state; all such shots are merged with the final screenshot.',
    capturesScreenshot: true,
    args: [
      {
        name: 'stitchOptions.blend',
        type: 'string',
        description: 'How this image blends when merged (defaults to `multiply`).',
      },
    ],
    example: { name: 'takeScreenshot' },
    notes: [
      'Captures the whole viewport — prefer `takeElementScreenshot` for component focus.',
    ],
    keywords: ['viewport', 'sequence', 'merge', 'intermediate'],
  },
  {
    name: 'takeScreenshotAll',
    category: 'screenshot',
    description:
      'Captures a viewport screenshot after every subsequent action in the set. All shots are merged at the end — handy for documenting a whole interaction flow.',
    capturesScreenshot: true,
    example: { name: 'takeScreenshotAll' },
    keywords: ['every', 'flow', 'sequence', 'merge'],
  },
  {
    name: 'takeScreenshotOptions',
    category: 'screenshot',
    description:
      'Sets centralized merge options for the screenshots in the current action set (merge type + stitch/overlay options). Only one instance is allowed and it only affects `takeScreenshot`.',
    args: [
      {
        name: 'mergeType',
        type: '"stitch" | "overlay"',
        description: 'How multiple screenshots are combined. Default is `stitch`.',
      },
      {
        name: 'stitchOptions',
        type: 'object',
        description: 'direction/align/offset/margin/color for stitched output.',
      },
      {
        name: 'overlayOptions',
        type: 'object',
        description: 'blend mode used when overlaying.',
      },
    ],
    example: { name: 'takeScreenshotOptions', args: { mergeType: 'stitch' } },
    keywords: ['merge', 'stitch', 'overlay', 'combine'],
  },

  // ---------------------------------------------------------------------------
  // Interaction actions (standard Playwright Page methods)
  // ---------------------------------------------------------------------------
  {
    name: 'click',
    category: 'interaction',
    description: 'Clicks the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to click. Prefer `[data-testid]`/`[data-slot]`/`#id`.',
      },
      { name: 'options', type: 'object', description: 'Playwright click options.' },
    ],
    example: { name: 'click', args: { selector: '#submit-button' } },
    keywords: ['tap', 'press', 'button'],
  },
  {
    name: 'dblclick',
    category: 'interaction',
    description: 'Double-clicks the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to double-click.',
      },
    ],
    example: { name: 'dblclick', args: { selector: '#cell' } },
    keywords: ['double'],
  },
  {
    name: 'hover',
    category: 'interaction',
    description:
      'Hovers over the element matching `selector` — commonly used to reveal tooltips, menus, or hover states before a screenshot.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to hover.',
      },
    ],
    example: { name: 'hover', args: { selector: '[data-slot="trigger"]' } },
    keywords: ['tooltip', 'mouseover', 'reveal'],
  },
  {
    name: 'fill',
    category: 'interaction',
    description: 'Fills an `<input>`, `<textarea>` or `[contenteditable]` with `value`.',
    args: [
      { name: 'selector', type: 'string', required: true, description: 'Field to fill.' },
      { name: 'value', type: 'string', required: true, description: 'Text to set.' },
    ],
    example: { name: 'fill', args: { selector: '#email', value: 'hi@example.com' } },
    keywords: ['input', 'text', 'form', 'value'],
  },
  {
    name: 'type',
    category: 'interaction',
    description:
      'Types `text` character by character (fires key events). Prefer `fill` unless the field needs real keystrokes.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Field to type into.',
      },
      { name: 'text', type: 'string', required: true, description: 'Text to type.' },
    ],
    example: { name: 'type', args: { selector: '#search', text: 'abc' } },
    keywords: ['keyboard', 'input', 'keystrokes'],
  },
  {
    name: 'press',
    category: 'interaction',
    description:
      'Focuses the element and presses `key` (e.g. `Enter`, `Escape`, `ArrowDown`).',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to focus.',
      },
      {
        name: 'key',
        type: 'string',
        required: true,
        description: 'Key or shortcut to press.',
      },
    ],
    example: { name: 'press', args: { selector: '#search', key: 'Enter' } },
    keywords: ['key', 'enter', 'escape', 'shortcut'],
  },
  {
    name: 'focus',
    category: 'interaction',
    description:
      'Focuses the element matching `selector` (useful for focus-state screenshots).',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to focus.',
      },
    ],
    example: { name: 'focus', args: { selector: '#input' } },
    keywords: ['focus-visible', 'ring', 'active'],
  },
  {
    name: 'check',
    category: 'interaction',
    description: 'Checks a checkbox or radio input matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Checkbox/radio to check.',
      },
    ],
    example: { name: 'check', args: { selector: '#agree' } },
    keywords: ['checkbox', 'radio', 'toggle'],
  },
  {
    name: 'uncheck',
    category: 'interaction',
    description: 'Unchecks a checkbox matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Checkbox to uncheck.',
      },
    ],
    example: { name: 'uncheck', args: { selector: '#agree' } },
    keywords: ['checkbox', 'toggle'],
  },
  {
    name: 'clearInput',
    category: 'interaction',
    description:
      'Addon extra: focuses the field matching `selector`, clears its value, and fires an `input` event. Throws if the element is not an input/textarea/contenteditable.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Field to clear.',
      },
      {
        name: 'options',
        type: '{ timeout?: number; blur?: boolean }',
        description: 'Optional wait timeout and whether to blur afterward.',
      },
    ],
    example: { name: 'clearInput', args: { selector: '#email' } },
    keywords: ['clear', 'reset', 'input', 'empty'],
  },

  // ---------------------------------------------------------------------------
  // Mouse actions
  // ---------------------------------------------------------------------------
  {
    name: 'mouse.click',
    category: 'mouse',
    description:
      'Clicks at absolute viewport coordinates `x`,`y` (not tied to a selector).',
    args: [
      {
        name: 'x',
        type: 'number',
        required: true,
        description: 'X coordinate in CSS pixels.',
      },
      {
        name: 'y',
        type: 'number',
        required: true,
        description: 'Y coordinate in CSS pixels.',
      },
    ],
    example: { name: 'mouse.click', args: { x: 100, y: 200 } },
    notes: [
      'Coordinate clicks are brittle across viewports — prefer selector-based `click` when possible.',
    ],
    keywords: ['coordinate', 'position', 'point'],
  },
  {
    name: 'mouse.move',
    category: 'mouse',
    description: 'Moves the mouse to absolute viewport coordinates `x`,`y`.',
    args: [
      { name: 'x', type: 'number', required: true, description: 'X coordinate.' },
      { name: 'y', type: 'number', required: true, description: 'Y coordinate.' },
    ],
    example: { name: 'mouse.move', args: { x: 100, y: 200 } },
    keywords: ['coordinate', 'position'],
  },
  {
    name: 'mouse.dblclick',
    category: 'mouse',
    description: 'Double-clicks at absolute viewport coordinates `x`,`y`.',
    args: [
      { name: 'x', type: 'number', required: true, description: 'X coordinate.' },
      { name: 'y', type: 'number', required: true, description: 'Y coordinate.' },
    ],
    example: { name: 'mouse.dblclick', args: { x: 100, y: 200 } },
    keywords: ['coordinate', 'double'],
  },
  {
    name: 'mouse.down',
    category: 'mouse',
    description:
      'Presses the mouse button down at the current pointer position (low-level; pair with `mouse.move` + `mouse.up`).',
    args: [
      {
        name: 'options',
        type: '{ button?: string; clickCount?: number }',
        description: 'Button options.',
      },
    ],
    example: { name: 'mouse.down' },
    keywords: ['press', 'hold', 'drag', 'low-level'],
  },
  {
    name: 'mouse.up',
    category: 'mouse',
    description: 'Releases the mouse button at the current pointer position (low-level).',
    args: [
      {
        name: 'options',
        type: '{ button?: string; clickCount?: number }',
        description: 'Button options.',
      },
    ],
    example: { name: 'mouse.up' },
    keywords: ['release', 'drag', 'low-level'],
  },
  {
    name: 'mouseDownOnSelector',
    category: 'mouse',
    description:
      'Addon extra: performs a `mousedown` on the center of the element matching `selector` (useful for drag/press states).',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to press.',
      },
      {
        name: 'point',
        type: '{ x?: number; y?: number }',
        description: 'Optional offset within the element.',
      },
    ],
    example: { name: 'mouseDownOnSelector', args: { selector: '[data-slot="thumb"]' } },
    keywords: ['drag', 'press', 'hold'],
  },
  {
    name: 'mouseMoveToSelector',
    category: 'mouse',
    description:
      'Addon extra: moves the mouse to the center of the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Target element.',
      },
    ],
    example: { name: 'mouseMoveToSelector', args: { selector: '#target' } },
    keywords: ['drag', 'move'],
  },
  {
    name: 'mouseFromTo',
    category: 'mouse',
    description:
      'Addon extra: performs a full mouse down → move → up between two viewport positions `from` and `to`.',
    args: [
      {
        name: 'from',
        type: '{ x: number; y: number }',
        required: true,
        description: 'Start point.',
      },
      {
        name: 'to',
        type: '{ x: number; y: number }',
        required: true,
        description: 'End point.',
      },
    ],
    example: {
      name: 'mouseFromTo',
      args: { from: { x: 10, y: 10 }, to: { x: 200, y: 10 } },
    },
    keywords: ['drag', 'swipe', 'slider'],
  },
  {
    name: 'dragDropSelector',
    category: 'mouse',
    description:
      'Addon extra: grabs the element matching `selector` and drops it at position `to`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to drag.',
      },
      {
        name: 'to',
        type: '{ x: number; y: number }',
        required: true,
        description: 'Drop position.',
      },
    ],
    example: {
      name: 'dragDropSelector',
      args: { selector: '#card', to: { x: 300, y: 0 } },
    },
    keywords: ['drag', 'drop', 'sortable', 'reorder'],
  },
  {
    name: 'selectorMouseWheel',
    category: 'mouse',
    description:
      'Addon extra: dispatches a `WheelEvent` on the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to scroll.',
      },
      {
        name: 'eventInitDict',
        type: '{ deltaX?: number; deltaY?: number; ... }',
        description: 'Wheel delta values.',
      },
    ],
    example: {
      name: 'selectorMouseWheel',
      args: { selector: '#list', eventInitDict: { deltaY: 200 } },
    },
    keywords: ['wheel', 'scroll'],
  },

  // ---------------------------------------------------------------------------
  // Layout actions
  // ---------------------------------------------------------------------------
  {
    name: 'scrollSelector',
    category: 'layout',
    description:
      'Addon extra: sets `scrollLeft`/`scrollTop` on the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Scroll container.',
      },
      {
        name: 'scrollProperty',
        type: '{ top?: number; left?: number }',
        required: true,
        description: 'Scroll offsets to apply.',
      },
    ],
    example: {
      name: 'scrollSelector',
      args: { selector: '#list', scrollProperty: { top: 120 } },
    },
    keywords: ['scroll', 'position'],
  },
  {
    name: 'setSelectorSize',
    category: 'layout',
    description:
      'Addon extra: sets the `width` and/or `height` (CSS values) of the element matching `selector` — handy to pin a responsive component to a fixed size before capture.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to resize.',
      },
      { name: 'width', type: 'string', description: 'CSS width, e.g. "320px".' },
      { name: 'height', type: 'string', description: 'CSS height, e.g. "200px".' },
    ],
    example: { name: 'setSelectorSize', args: { selector: '#panel', width: '320px' } },
    keywords: ['resize', 'width', 'height', 'size'],
  },

  // ---------------------------------------------------------------------------
  // Wait actions
  // ---------------------------------------------------------------------------
  {
    name: 'waitForSelector',
    category: 'wait',
    description:
      'Waits until the element matching `selector` reaches `state` (visible/attached/hidden/detached). Use to wait for async UI before a screenshot.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Selector to wait for.',
      },
      {
        name: 'options.state',
        type: '"attached" | "detached" | "visible" | "hidden"',
        description: 'Target state. Defaults to `visible`.',
      },
      { name: 'options.timeout', type: 'number', description: 'Max ms to wait.' },
    ],
    example: {
      name: 'waitForSelector',
      args: { selector: '[data-slot="toast"]', options: { state: 'visible' } },
    },
    notes: ['Prefer waiting on a selector over `waitForTimeout` — it is far less flaky.'],
    keywords: ['wait', 'appear', 'ready', 'async'],
  },
  {
    name: 'waitForTimeout',
    category: 'wait',
    description:
      'Waits a fixed number of milliseconds. Use sparingly (e.g. to let an animation settle) — fixed waits are inherently flaky.',
    args: [
      {
        name: 'timeout',
        type: 'number',
        required: true,
        description: 'Milliseconds to wait.',
      },
    ],
    example: { name: 'waitForTimeout', args: { timeout: 300 } },
    notes: ['Prefer `waitForSelector` whenever you can wait on a concrete condition.'],
    keywords: ['delay', 'sleep', 'animation', 'settle'],
  },

  // ---------------------------------------------------------------------------
  // Touch actions
  // ---------------------------------------------------------------------------
  {
    name: 'touchscreen.tap',
    category: 'touch',
    description:
      'Taps at absolute viewport coordinates `x`,`y` (requires a touch-enabled context).',
    args: [
      { name: 'x', type: 'number', required: true, description: 'X coordinate.' },
      { name: 'y', type: 'number', required: true, description: 'Y coordinate.' },
    ],
    example: { name: 'touchscreen.tap', args: { x: 100, y: 200 } },
    keywords: ['tap', 'mobile', 'touch'],
  },
  {
    name: 'touchFromTo',
    category: 'touch',
    description:
      'Addon extra: dispatches `touchstart` → `touchmove` → `touchend` on the element matching `selector` (swipe/drag gestures).',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to gesture on.',
      },
      {
        name: 'pageFrom',
        type: '{ x?: number; y?: number }',
        description: 'Start page point.',
      },
      {
        name: 'pageTo',
        type: '{ x?: number; y?: number }',
        description: 'End page point.',
      },
    ],
    example: {
      name: 'touchFromTo',
      args: {
        selector: '#carousel',
        pageFrom: { x: 300, y: 100 },
        pageTo: { x: 50, y: 100 },
      },
    },
    keywords: ['swipe', 'gesture', 'carousel', 'mobile'],
  },
  {
    name: 'touchStart',
    category: 'touch',
    description:
      'Addon extra: dispatches a `touchstart` event on the element matching `selector` (low-level; usually prefer `touchFromTo`).',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to touch.',
      },
      {
        name: 'page',
        type: '{ x?: number; y?: number }',
        description: 'Page-relative touch point.',
      },
    ],
    example: { name: 'touchStart', args: { selector: '#swipe' } },
    keywords: ['touch', 'mobile', 'gesture', 'low-level'],
  },
  {
    name: 'touchMove',
    category: 'touch',
    description:
      'Addon extra: dispatches a `touchmove` event on the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to touch.',
      },
      {
        name: 'page',
        type: '{ x?: number; y?: number }',
        description: 'Page-relative touch point.',
      },
    ],
    example: { name: 'touchMove', args: { selector: '#swipe', page: { x: 50, y: 100 } } },
    keywords: ['touch', 'mobile', 'gesture', 'low-level'],
  },
  {
    name: 'touchEnd',
    category: 'touch',
    description:
      'Addon extra: dispatches a `touchend` event on the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to touch.',
      },
    ],
    example: { name: 'touchEnd', args: { selector: '#swipe' } },
    keywords: ['touch', 'mobile', 'gesture', 'low-level'],
  },
  {
    name: 'touchCancel',
    category: 'touch',
    description:
      'Addon extra: dispatches a `touchcancel` event on the element matching `selector`.',
    args: [
      {
        name: 'selector',
        type: 'string',
        required: true,
        description: 'Element to touch.',
      },
    ],
    example: { name: 'touchCancel', args: { selector: '#swipe' } },
    keywords: ['touch', 'mobile', 'gesture', 'low-level'],
  },

  // ---------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------
  {
    name: 'keyboard.press',
    category: 'keyboard',
    description:
      'Presses `key` on the virtual keyboard without targeting a selector (the currently focused element receives it). Supports shortcuts like `Control+A`.',
    args: [
      {
        name: 'key',
        type: 'string',
        required: true,
        description: 'Key or shortcut to press.',
      },
    ],
    example: { name: 'keyboard.press', args: { key: 'Escape' } },
    keywords: ['key', 'shortcut', 'escape', 'enter'],
  },
  {
    name: 'keyboard.type',
    category: 'keyboard',
    description: 'Types `text` on the virtual keyboard into the focused element.',
    args: [
      { name: 'text', type: 'string', required: true, description: 'Text to type.' },
    ],
    example: { name: 'keyboard.type', args: { text: 'hello' } },
    keywords: ['type', 'text', 'input'],
  },
  {
    name: 'keyboard.down',
    category: 'keyboard',
    description:
      'Holds `key` down on the virtual keyboard (low-level; pair with `keyboard.up`).',
    args: [
      { name: 'key', type: 'string', required: true, description: 'Key to hold down.' },
    ],
    example: { name: 'keyboard.down', args: { key: 'Shift' } },
    keywords: ['hold', 'modifier', 'low-level'],
  },
  {
    name: 'keyboard.up',
    category: 'keyboard',
    description:
      'Releases `key` on the virtual keyboard (low-level; pairs with `keyboard.down`).',
    args: [
      { name: 'key', type: 'string', required: true, description: 'Key to release.' },
    ],
    example: { name: 'keyboard.up', args: { key: 'Shift' } },
    keywords: ['release', 'modifier', 'low-level'],
  },
  {
    name: 'keyboard.insertText',
    category: 'keyboard',
    description:
      'Inserts `text` directly (fires only an `input` event, no key events). Useful for characters not on a US keyboard.',
    args: [
      { name: 'text', type: 'string', required: true, description: 'Text to insert.' },
    ],
    example: { name: 'keyboard.insertText', args: { text: '嗨' } },
    keywords: ['insert', 'unicode', 'text'],
  },
];
