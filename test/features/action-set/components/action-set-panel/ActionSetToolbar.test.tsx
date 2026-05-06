import { ActionToolbar } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetToolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { DeleteConfirmationButton } from '../../../../../src/components/common';

describe('ActionToolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={vi.fn()}
        onDeleteSelectedActionSets={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should invoke toolbar action callbacks', () => {
    const onAddActionSet = vi.fn();
    const onDeleteSelectedActionSets = vi.fn();
    const onReset = vi.fn();

    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={onAddActionSet}
        onDeleteSelectedActionSets={onDeleteSelectedActionSets}
        onReset={onReset}
      />,
    );

    const buttons = wrapper.find(IconButton);
    buttons
      .filterWhere((node) => node.prop('title') === 'Reset')
      .at(0)
      .props()
      .onClick?.({} as React.MouseEvent<HTMLElement>);
    buttons
      .filterWhere((node) => node.prop('title') === 'Add Action Set')
      .at(0)
      .props()
      .onClick?.({} as React.MouseEvent<HTMLElement>);

    wrapper.find(DeleteConfirmationButton).props().onDelete();

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onAddActionSet).toHaveBeenCalledTimes(1);
    expect(onDeleteSelectedActionSets).toHaveBeenCalledTimes(1);
  });

  it('should pass deleteDisabled to DeleteConfirmationButton', () => {
    const wrapper = shallow(
      <ActionToolbar
        deleteDisabled={true}
        onAddActionSet={vi.fn()}
        onDeleteSelectedActionSets={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(wrapper.find(DeleteConfirmationButton).props().disabled).toBe(true);
  });
});
