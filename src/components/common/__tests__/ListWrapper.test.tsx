import { ListWrapper } from '../ListWrapper';
import { shallow } from 'enzyme';
import React, { createElement } from 'react';

// Changed to async factory using vi.importActual because jest.requireActual
// does not exist in vitest (no sync equivalent; vi.importActual is async-only).
vi.mock('react', async () => ({
  ...((await vi.importActual('react')) as object),
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
