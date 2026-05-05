/**
 * Global module mocks that were automatically applied by jest because of manual
 * mock files in the __mocks__ directory adjacent to node_modules.
 *
 * In vitest, node_module mocks from __mocks__/ are NOT applied automatically —
 * they require an explicit vi.mock() call. This file registers them globally so
 * all test files get the same mock behavior as they had under jest.
 *
 * Individual test files that need the real implementation call vi.unmock() (or
 * jest.unmock() which the vitest-jest-mock-compat plugin transforms).
 */

vi.mock('@storybook/manager-api');
vi.mock('@storybook/addons');
vi.mock('@storybook/components');
vi.mock('@storybook/core-events');
vi.mock('@storybook/theming');
vi.mock('react-toastify');
vi.mock('reinspect');
vi.mock('nanoid');
vi.mock('fast-glob');
vi.mock('fs');
// sharp and join-images use __mocks__/ manual mocks rather than resolve.alias
// so that vi.mock patches CJS require() calls in pre-built dist/ files too.
vi.mock('sharp');
vi.mock('join-images');
// jest-image-snapshot: __mocks__/jest-image-snapshot.ts provides a vi.fn() spy
// so tests can configure mockImplementationOnce without importing the real snap.
vi.mock('jest-image-snapshot');
// react-use sub-path mocks (useKey, useMouseHovered, useThrottleFn).
// Jest applied __mocks__/react-use/lib/* automatically; vitest requires explicit calls.
vi.mock('react-use/lib/useKey');
vi.mock('react-use/lib/useThrottleFn');
vi.mock('react-use/lib/useMouseHovered');
