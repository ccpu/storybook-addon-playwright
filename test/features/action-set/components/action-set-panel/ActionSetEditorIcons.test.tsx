import { ActionSetEditorIcons } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetEditorIcons';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionMenu } from '../../../../../src/features/action-set/components/action-set-panel/ActionMenu';

vi.mock(
  '../../../../../src/features/schema/hooks/use-action-schema-loader',
  async () =>
    await import('../../../schema/hooks/__mocks__/use-action-schema-loader'),
);

describe('ActionSetEditorIcons', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionSetEditorIcons
        onAddAction={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onEditTitle={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle action menu', () => {
    const onAddActionMock = vi.fn();
    const wrapper = shallow(
      <ActionSetEditorIcons
        onAddAction={onAddActionMock}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onEditTitle={vi.fn()}
      />,
    );
    wrapper
      .find('.open-action-menu')
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<
        undefined,
        MouseEvent
      >);

    const actionMenu = wrapper.find(ActionMenu);

    expect(actionMenu.props().anchorEl).toBeDefined();

    actionMenu.props().onChange('click');

    expect(onAddActionMock).toHaveBeenCalledWith('click');

    actionMenu.props().onClose();

    expect(wrapper.find(ActionMenu).props().anchorEl).toBe(null);
  });
});
