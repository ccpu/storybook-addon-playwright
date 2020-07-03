import '../../../../__manual_mocks__/store/action/context';
import React from 'react';
import { ActionMenu } from '../ActionMenu';
import { shallow } from 'enzyme';
import { ActionMenuItem } from '../ActionMenuItem';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
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
        onChange={jest.fn()}
        anchorEl={document.createElement('div')}
        onClose={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle item click', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(
      <ActionMenu
        onChange={changeMock}
        anchorEl={document.createElement('div')}
        onClose={jest.fn()}
      />,
    );

    const item = wrapper.find(ActionMenuItem);
    expect(item).toHaveLength(1);
    item.props().onChange('click');
    expect(changeMock).toHaveBeenCalledTimes(1);
  });
});
