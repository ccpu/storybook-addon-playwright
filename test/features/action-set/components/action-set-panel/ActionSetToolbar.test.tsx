import { ActionToolbar } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetToolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { DeleteConfirmationButton } from '../../../../../src/components/common';
import { ActionMenu } from '../../../../../src/features/action-set/components/action-set-panel/ActionMenu';

vi.mock('../../../../../src/features/schema/hooks/use-action-schema-loader', () => ({
  useActionSchemaLoader: () => ({ loading: false }),
}));

describe('ActionToolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onAddAction={vi.fn()}
        onAddActionSet={vi.fn()}
        onDeleteSelectedActionSets={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should invoke toolbar action callbacks', () => {
    const onAddAction = vi.fn();
    const onAddActionSet = vi.fn();
    const onDeleteSelectedActionSets = vi.fn();
    const onReset = vi.fn();

    const wrapper = shallow(
      <ActionToolbar
        onAddAction={onAddAction}
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

    buttons
      .filterWhere((node) => node.prop('title') === 'Add Quick Action')
      .at(0)
      .props()
      .onClick?.({ currentTarget: {} } as React.MouseEvent<HTMLElement>);

    wrapper.find(ActionMenu).props().onChange('waitForTimeout');

    wrapper.find(DeleteConfirmationButton).props().onDelete();

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onAddAction).toHaveBeenCalledWith('waitForTimeout');
    expect(onAddActionSet).toHaveBeenCalledTimes(1);
    expect(onDeleteSelectedActionSets).toHaveBeenCalledTimes(1);
  });

  it('should pass deleteDisabled to DeleteConfirmationButton', () => {
    const wrapper = shallow(
      <ActionToolbar
        deleteDisabled={true}
        onAddAction={vi.fn()}
        onAddActionSet={vi.fn()}
        onDeleteSelectedActionSets={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(wrapper.find(DeleteConfirmationButton).props().disabled).toBe(true);
  });
});
