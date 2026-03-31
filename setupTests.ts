import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import '@testing-library/jest-dom';

// Polyfill setImmediate for jsdom (missing in newer Node.js)
if (typeof globalThis.setImmediate === 'undefined') {
  (globalThis as any).setImmediate = (
    fn: (...args: any[]) => void,
    ...args: any[]
  ) => setTimeout(fn, 0, ...args);
}

//! uncomment this will cause problem with vitest mocks
// const { toMatchScreenshots } = require('./src/to-match-screenshots');
// expect.extend({ toMatchScreenshots });

expect.extend({ toMatchImageSnapshot });

// Re-enable jest-fetch-mock so that tests importing 'jest-fetch-mock' directly
// (e.g. fetch.mockResponseOnce) keep working. The jest global shim in
// setupTests.vitest-globals.ts ensures jest.fn() is available when the module
// initialises. vi.stubGlobal is kept as fallback comment only.
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('jest-fetch-mock').enableMocks();

enzyme.configure({ adapter: new Adapter() });
