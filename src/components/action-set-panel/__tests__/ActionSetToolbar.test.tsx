import { ActionToolbar } from '../ActionSetToolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';

describe('ActionToolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={jest.fn()}
        onReset={jest.fn()}
        onAddQuickAction={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should add quick action', () => {
    const addActionMock = jest.fn();

    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={jest.fn()}
        onReset={jest.fn()}
        onAddQuickAction={addActionMock}
      />,
    );
    wrapper
      .find(IconButton)
      .first()
      .props()
      .onClick({ currentTarget: { name: 'foo', title: 'bar' } } as never);

    expect(addActionMock).toHaveBeenCalledWith('foo', 'bar');
  });
});
