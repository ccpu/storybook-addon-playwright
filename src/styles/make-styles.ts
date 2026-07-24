import type { Theme } from '../features/theme/create-theme';
import { css } from '@emotion/css';
import { useTheme } from './theme-context';

type StyleRule = Record<string, unknown>;
type StyleRules = Record<string, StyleRule>;
type StylesArg<Props> = StyleRules | ((theme: Theme, props: Props) => StyleRules);

// Resolves `@mui/styles`-style prop-dependent values (e.g. `width: (p) => p.width`)
// by invoking any function value with the props passed to the hook.
function resolvePropValues(node: unknown, props: unknown): unknown {
  if (typeof node === 'function') {
    return (node as (p: unknown) => unknown)(props);
  }
  if (Array.isArray(node)) {
    return node.map((child) => resolvePropValues(child, props));
  }
  if (node && typeof node === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = resolvePropValues(value, props);
    }
    return result;
  }
  return node;
}

interface MakeStylesOptions {
  /** Accepted for API compatibility with `@mui/styles`; used only as a label. */
  name?: string;
}

const REF_PATTERN = /\$(\w+)/g;

// Collects the JSS-style `$ruleName` self-references used inside a rule's
// nested selector keys (and any string values), so they can be resolved to the
// generated class names before the rule is serialized.
function collectRefs(node: unknown, refs: Set<string>): void {
  if (Array.isArray(node)) {
    node.forEach((child) => collectRefs(child, refs));
    return;
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      for (const match of key.matchAll(REF_PATTERN)) refs.add(match[1]);
      collectRefs(value, refs);
    }
  }
}

// Replaces `$ruleName` tokens in selector keys with the resolved `.className`.
function substituteRefs(node: unknown, classNames: Record<string, string>): unknown {
  if (Array.isArray(node)) {
    return node.map((child) => substituteRefs(child, classNames));
  }
  if (node && typeof node === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      const newKey = key.replace(REF_PATTERN, (match, name: string) =>
        classNames[name] ? `.${classNames[name]}` : match,
      );
      result[newKey] = substituteRefs(value, classNames);
    }
    return result;
  }
  return node;
}

// Generates a class name for every rule, resolving `$ref` self-references in
// dependency order (a rule is emitted once all rules it references are ready).
function resolveClasses(styles: StyleRules, name: string): Record<string, string> {
  const keys = Object.keys(styles);
  const emotionClasses: Record<string, string> = {};
  const pending = new Set(keys);

  let processed = true;
  while (pending.size > 0 && processed) {
    processed = false;
    for (const key of [...pending]) {
      const refs = new Set<string>();
      collectRefs(styles[key], refs);
      const unresolved = [...refs].filter(
        (ref) => keys.includes(ref) && emotionClasses[ref] === undefined,
      );
      if (unresolved.length === 0) {
        emotionClasses[key] = css(
          substituteRefs(styles[key], emotionClasses) as Parameters<typeof css>[0],
        );
        pending.delete(key);
        processed = true;
      }
    }
  }

  // Resolve any remaining rules (e.g. circular references) best-effort.
  for (const key of pending) {
    emotionClasses[key] = css(
      substituteRefs(styles[key], emotionClasses) as Parameters<typeof css>[0],
    );
  }

  // Prepend a readable `${name}-${key}` marker class (as `@mui/styles` did),
  // keeping the emotion-generated class that actually carries the styles.
  const classNames: Record<string, string> = {};
  for (const key of keys) {
    classNames[key] = `${name}-${key} ${emotionClasses[key]}`;
  }
  return classNames;
}

/**
 * A drop-in replacement for `@mui/styles`' `makeStyles`, backed by emotion.
 * Returns a hook that resolves the (optionally theme/props-dependent) style
 * rules to generated class names.
 *
 * Supports the JSS `$ruleName` self-reference syntax used by the existing call
 * sites (e.g. `'& $icon': { color: ... }`).
 */
export function makeStyles<Props extends object = Record<string, unknown>>(
  stylesArg: StylesArg<Props>,
  options?: MakeStylesOptions,
) {
  const name = options?.name ?? 'makeStyles';

  return function useStyles(props?: Props): Record<string, string> {
    const theme = useTheme();
    const resolvedProps = (props ?? {}) as Props;
    const styles =
      typeof stylesArg === 'function' ? stylesArg(theme, resolvedProps) : stylesArg;
    return resolveClasses(resolvePropValues(styles, resolvedProps) as StyleRules, name);
  };
}
