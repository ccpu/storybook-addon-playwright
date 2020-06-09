import React, { createElement } from 'react';
import { Selector } from '../Selector';
import { shallow } from 'enzyme';
import { useSelectorManager } from '../../../hooks/use-selector-manager';
import { SelectorOverlay } from '../SelectorOverlay';

jest.mock('../../../hooks/use-selector-manager');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
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
    (useSelectorManager as jest.Mock).mockImplementationOnce(() => ({
      selectorManager: { start: true },
    }));
    const wrapper = shallow(<Selector />);
    expect(wrapper.find(SelectorOverlay)).toHaveLength(1);
  });
});
