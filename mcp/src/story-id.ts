/**
 * Story-id derivation, replicating Storybook's `@storybook/csf` `toId` +
 * `storyNameFromExport`. This is the single most error-prone part of authoring an
 * action file: the key of each entry in the `stories` object **must** equal the
 * Storybook story id, or the addon will not match the screenshot to the story.
 *
 * The addon itself never computes this — at runtime it reads `storyId` straight
 * from Storybook state. So the source of truth is Storybook's own algorithm,
 * reproduced here for offline authoring.
 *
 * The id is `${sanitize(title)}--${sanitize(storyNameFromExport(exportName))}`:
 *
 * - The **title** part is only lowercased/hyphenated — it is NOT split into
 *   words. `Components/Jobs/JobFilterToolbar` -> `components-jobs-jobfiltertoolbar`
 *   (note: `JobFilterToolbar` stays as one run, no internal hyphens).
 * - The **story** part first splits the export identifier into words at
 *   camelCase / PascalCase / acronym / digit boundaries (Storybook's
 *   `startCase`), then lowercases/hyphenates. `WithActiveFilters` ->
 *   `with-active-filters`.
 *
 * A naive `exportName.toLowerCase()` is the classic mistake: it produces
 * `withactivefilters` instead of `with-active-filters`.
 */

/**
 * Split an identifier into words at case/digit boundaries, mirroring the
 * word-splitting lodash `startCase` (used by `@storybook/csf.storyNameFromExport`)
 * performs. The result is space-joined; casing is irrelevant because {@link sanitize}
 * lowercases afterwards. Only the word boundaries matter for the final id.
 *
 * Boundaries inserted:
 * - lower/digit -> Upper  (`fooBar` -> `foo Bar`)
 * - acronym run -> Word   (`HTMLParser` -> `HTML Parser`)
 * - letter -> digit and digit -> letter (`foo2Bar` -> `foo 2 Bar`)
 */
export function storyNameFromExport(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2');
}

/**
 * Lowercase a string and collapse every run of spaces/punctuation into single
 * hyphens, trimming leading/trailing hyphens. Byte-for-byte the same character
 * class as `@storybook/csf`'s `sanitize`.
 */
export function sanitize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ '’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export interface StoryIdParts {
  /** The full story id, i.e. the key inside the `stories` object. */
  storyId: string;
  /** `sanitize(title)` — the part before `--`. */
  titlePart: string;
  /** `sanitize(storyNameFromExport(name))` — the part after `--`. */
  storyPart: string;
}

/**
 * Compute the Storybook story id from a component `title` and a story name.
 *
 * @param title  The meta `title` (e.g. `Components/Jobs/JobFilterToolbar`).
 * @param name   The story's export identifier (e.g. `WithActiveFilters`) OR an
 *               explicit `storyName` / `name` if the story overrides it. Either
 *               way it is passed through `storyNameFromExport` + `sanitize`,
 *               which is idempotent for already-spaced display names.
 */
export function getStoryId(title: string, name: string): StoryIdParts {
  const titlePart = sanitize(title);
  const storyPart = sanitize(storyNameFromExport(name));

  return {
    storyId: `${titlePart}--${storyPart}`,
    titlePart,
    storyPart,
  };
}
