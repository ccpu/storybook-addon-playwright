import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

//! uncomment this will cause problem with jest mocks
// const { toMatchScreenshots } = require('./src/to-match-screenshots');
// expect.extend({ toMatchScreenshots });

expect.extend({ toMatchImageSnapshot });

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('jest-fetch-mock').enableMocks();
enzyme.configure({ adapter: new Adapter() });
