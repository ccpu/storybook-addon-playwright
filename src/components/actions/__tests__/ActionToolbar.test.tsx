import React from 'react';
import { ActionToolbar } from '../ActionToolbar';
import { shallow } from 'enzyme';
import { ConfirmationPopover, InputDialog } from '../../common';
import { ActionMenu } from '../ActionMenu';

describe('ActionToolbar', () => {
  const onAddActionMock = jest.fn();
  const onDescriptionChangeMock = jest.fn();
  const onSaveMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onAddActionMock.mockClear();
    onDescriptionChangeMock.mockClear();
    onCloseMock.mockClear();
    onSaveMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onClose={onCloseMock}
        onSave={onSaveMock}
        onAddAction={onAddActionMock}
        onDescriptionChange={onDescriptionChangeMock}
        description="desc"
      />,
    );
    expect(wrapper.exists).toBeTruthy();
  });

  it('should cancel changes', () => {
    const wrapper = shallow(
      <ActionToolbar
        onClose={onCloseMock}
        onSave={onSaveMock}
        onAddAction={onAddActionMock}
        onDescriptionChange={onDescriptionChangeMock}
        description="desc"
      />,
    );
    const iconButton = wrapper.find('.close');
    iconButton.props().onClick(({
      currentTarget: {},
    } as unknown) as React.MouseEvent<{}, MouseEvent>);

    const dialog = wrapper.find(ConfirmationPopover);

    dialog.props().onConfirm();

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should handle add action', () => {
    const wrapper = shallow(
      <ActionToolbar
        onClose={onCloseMock}
        onSave={onSaveMock}
        onAddAction={onAddActionMock}
        onDescriptionChange={onDescriptionChangeMock}
        description="desc"
      />,
    );
    const iconButton = wrapper.find(ActionMenu);
    iconButton.props().onChange('foo');

    expect(onAddActionMock).toHaveBeenCalledTimes(1);
  });

  it('should action menu open', () => {
    const wrapper = shallow(
      <ActionToolbar
        onClose={onCloseMock}
        onSave={onSaveMock}
        onAddAction={onAddActionMock}
        onDescriptionChange={onDescriptionChangeMock}
        description="desc"
      />,
    );
    const iconButton = wrapper.find('.add-action');
    iconButton.props().onClick(({
      currentTarget: {},
    } as unknown) as React.MouseEvent<{}, MouseEvent>);

    const menu = wrapper.find(ActionMenu);

    expect(menu.props().anchorEl).toStrictEqual({});
  });

  it('should handle menu close', () => {
    const wrapper = shallow(
      <ActionToolbar
        onClose={onCloseMock}
        onSave={onSaveMock}
        onAddAction={onAddActionMock}
        onDescriptionChange={onDescriptionChangeMock}
        description="desc"
      />,
    );
    const iconButton = wrapper.find('.add-action');
    iconButton.props().onClick(({
      currentTarget: {},
    } as unknown) as React.MouseEvent<{}, MouseEvent>);

    const menu = wrapper.find(ActionMenu);

    menu.props().onClose();

    const anchorEl = wrapper.find(ActionMenu).props().anchorEl;

    expect(anchorEl).toStrictEqual(null);
  });

  it('should handle description change', () => {
    const wrapper = shallow(
      <ActionToolbar
        onClose={onCloseMock}
        onSave={onSaveMock}
        onAddAction={onAddActionMock}
        onDescriptionChange={onDescriptionChangeMock}
        description="desc"
      />,
    );
    const iconButton = wrapper.find('.edit-desc');
    iconButton.props().onClick({} as React.MouseEvent<{}, MouseEvent>);

    const dialog = wrapper.find(InputDialog);

    expect(dialog).toHaveLength(1);

    dialog.props().onSave('foo');

    expect(onDescriptionChangeMock).toHaveBeenCalledWith('foo');
  });
});
