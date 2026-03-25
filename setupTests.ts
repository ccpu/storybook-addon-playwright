import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

// Polyfill setImmediate for jsdom (missing in newer Node.js)
if (typeof globalThis.setImmediate === 'undefined') {
  (globalThis as any).setImmediate = (
    fn: (...args: any[]) => void,
    ...args: any[]
  ) => setTimeout(fn, 0, ...args);
}

//! uncomment this will cause problem with jest mocks
// const { toMatchScreenshots } = require('./src/to-match-screenshots');
// expect.extend({ toMatchScreenshots });

expect.extend({ toMatchImageSnapshot });

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('jest-fetch-mock').enableMocks();
enzyme.configure({ adapter: new Adapter() });
