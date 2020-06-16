import 'jest-enzyme';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

require('jest-fetch-mock').enableMocks();
enzyme.configure({ adapter: new Adapter() });
