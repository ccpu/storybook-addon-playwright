// Changed: importing from 'jest-image-snapshot' inside its own __mocks__ file
// creates a circular reference in vitest. We export a plain vi.fn() spy instead.
// Tests that need specific snapshot behaviour configure the mock themselves.
export const toMatchImageSnapshot = vi.fn();
