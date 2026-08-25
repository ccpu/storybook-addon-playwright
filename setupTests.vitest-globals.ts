/**
 * Vitest global compatibility setup.
 *
 * The suite still contains legacy Jest helper calls. Vitest injects `vi` before
 * setup files run, so exposing it as `jest` keeps those tests working while the
 * addon runtime and its middleware are now native ESM.
 */
(globalThis as { jest?: typeof vi }).jest = vi;
