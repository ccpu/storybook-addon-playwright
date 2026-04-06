import '../../../../manual-mocks/store/action/context';
import React from 'react';
import { ActionMenu } from '../../../../../src/features/action-set/components/action-set-panel/ActionMenu';
import { shallow } from 'enzyme';
import { ActionMenuItem } from '../../../../../src/features/action-set/components/action-set-panel/ActionMenuItem';

// Changed to async factory using vi.importActual because jest.requireActual
// does not exist in vitest (no sync equivalent; vi.importActual is async-only).
vi.mock('react', async () => ({
  ...((await vi.importActual('react')) as object),
  useEffect: (f) => f(),
  useState: () => {
    let data = [{ label: 'click', name: 'click' }];
    const set = (d) => {
      data = d;
    };
    return [data, set];
  },
}));

describe('ActionMenu', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionMenu
        onChange={vi.fn()}
        anchorEl={document.createElement('div')}
        onClose={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle item click', () => {
    const changeMock = vi.fn();
    const wrapper = shallow(
      <ActionMenu
        onChange={changeMock}
        anchorEl={document.createElement('div')}
        onClose={vi.fn()}
      />,
    );

    const item = wrapper.find(ActionMenuItem);
    expect(item).toHaveLength(1);
    item.props().onChange('click');
    expect(changeMock).toHaveBeenCalledTimes(1);
  });
});
