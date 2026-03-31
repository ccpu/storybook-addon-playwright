import React, { createElement } from 'react';
import { Selector } from '../Selector';
import { shallow } from 'enzyme';
import { useSelectorManager } from '../../../hooks/use-selector-manager';
import { SelectorOverlay } from '../SelectorOverlay';

vi.mock('../../../hooks/use-selector-manager');

// Changed to async factory using vi.importActual because jest.requireActual
// does not exist in vitest (no sync equivalent; vi.importActual is async-only).
vi.mock('react', async () => ({
  ...((await vi.importActual('react')) as object),
  useEffect: (cb: () => void) => {
    cb();
  },
  useRef: () => ({ current: { querySelector: () => createElement('iframe') } }),
}));

describe('Selector', () => {
  it('should render', async () => {
    const wrapper = shallow(<Selector />);

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should shod selector overlay', async () => {
    (useSelectorManager as Mock).mockImplementationOnce(() => ({
      selectorManager: { start: true },
    }));
    const wrapper = shallow(<Selector />);
    expect(wrapper.find(SelectorOverlay)).toHaveLength(1);
  });
});
