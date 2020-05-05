import 'jest-enzyme';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
require('jest-fetch-mock').enableMocks();
enzyme.configure({ adapter: new Adapter() });
