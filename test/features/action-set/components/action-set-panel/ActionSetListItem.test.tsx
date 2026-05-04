import { ActionSetListItem } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetListItem';
import { shallow } from 'enzyme';
import React from 'react';
import {
  DeleteConfirmationButton,
  CheckBox,
  ListItemWrapper,
} from '../../../../../src/components/common';
import { ActionSetEditor } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetEditor';

describe('ActionSetListItem', () => {
  const deleteMock = vi.fn();
  const editMock = vi.fn();
  const onCheckMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        index={0}
        title="title"
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle edit', () => {
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        index={0}
        title="title"
      />,
    );

    const listItemWrapperWrapper = shallow(
      <div>{wrapper.find(ListItemWrapper).props().icons}</div>,
    );

    expect(listItemWrapperWrapper.exists()).toBeTruthy();

    const editButton = listItemWrapperWrapper.find('.edit-button');

    expect(editButton.exists()).toBeTruthy();

    editButton.props().onClick({} as React.MouseEvent<unknown, MouseEvent>);

    expect(editMock).toHaveBeenCalledTimes(1);
  });

  it('should handle delete', () => {
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        index={0}
        title="title"
      />,
    );

    const listItemWrapperWrapper = shallow(
      <div>{wrapper.find(ListItemWrapper).props().icons}</div>,
    );

    listItemWrapperWrapper.find(DeleteConfirmationButton).props().onDelete();

    expect(deleteMock).toHaveBeenCalledTimes(1);
  });

  it('should handle checkbox', () => {
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        onCheckBoxClick={onCheckMock}
        index={0}
        title="title"
      />,
    );

    const listItemWrapperWrapper = shallow(
      <div>{wrapper.find(ListItemWrapper).props().icons}</div>,
    );

    listItemWrapperWrapper.find(CheckBox).props().onClick();

    expect(onCheckMock).toHaveBeenCalledTimes(1);
  });

  it('should handle render ActionSetEditor  when editing action-set', () => {
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        onCheckBoxClick={onCheckMock}
        index={0}
        title="title"
        isEditing={true}
      />,
    );
    expect(wrapper.find(ActionSetEditor)).toBeTruthy();
  });

  it('should hide icons except checkbox when editing other action-set', () => {
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        onCheckBoxClick={onCheckMock}
        index={0}
        title="title"
        isEditing={false}
        hideIcons={true}
      />,
    );
    expect(wrapper.find(ActionSetEditor)).toBeTruthy();
    const listItemWrapperWrapper = shallow(
      <div>{wrapper.find(ListItemWrapper).props().icons}</div>,
    );

    expect(listItemWrapperWrapper.find(CheckBox).exists()).toBeTruthy();
    expect(listItemWrapperWrapper.find('.edit-button').exists()).toBeFalsy();
    expect(
      listItemWrapperWrapper.find(DeleteConfirmationButton).exists(),
    ).toBeFalsy();
  });

  it('should catt copy action set', () => {
    const copyMock = vi.fn();
    const wrapper = shallow(
      <ActionSetListItem
        item={{ actions: [], id: 'action-set-id', title: 'desc' }}
        onDelete={deleteMock}
        onEdit={editMock}
        onCopy={copyMock}
        onCheckBoxClick={onCheckMock}
        index={0}
        title="title"
      />,
    );

    const listItemWrapperWrapper = shallow(
      <div>{wrapper.find(ListItemWrapper).props().icons}</div>,
    );
    listItemWrapperWrapper
      .find('.copy-button')
      .props()
      .onClick({} as never);

    expect(copyMock).toHaveBeenCalledWith({
      actions: [],
      id: 'action-set-id',
      title: 'desc',
    });
  });
});
