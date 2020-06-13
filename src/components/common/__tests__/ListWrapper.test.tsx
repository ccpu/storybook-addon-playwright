import { ListWrapper } from '../ListWrapper';
import { shallow } from 'enzyme';
import React, { createElement } from 'react';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cb: () => void) => {
    cb();
  },
  useRef: () => ({ current: { querySelector: () => createElement('div') } }),
}));

describe('ListWrapper', () => {
  it('should render', () => {
    const wrapper = shallow(<ListWrapper />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
