import { ListItem } from '../listItem';
import { shallow } from 'enzyme';
import React from 'react';
import { ConfirmationPopover } from '../ConfirmationPopover';
import CheckBox from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxChecked from '@material-ui/icons/CheckBox';

describe('ListItem', () => {
  const onDeleteMock = jest.fn();
  const onEditMock = jest.fn();

  const item = () => {
    return {
      val: 'string',
    };
  };

  beforeEach(() => {
    onDeleteMock.mockClear();
    onEditMock.mockClear();
  });

  it('should render ', () => {
    const wrapper = shallow(
      <ListItem
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        index={0}
        item={item}
        title="item-desc"
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
  it('should handle edit ', () => {
    const wrapper = shallow(
      <ListItem
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        index={0}
        item={item}
        title="item-desc"
      />,
    );

    const editButton = wrapper.find('.edit-button');

    editButton.props().onClick({} as React.MouseEvent<{}, MouseEvent>);

    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it('should handle delete confirmation ', () => {
    const wrapper = shallow(
      <ListItem
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        index={0}
        item={item}
        title="item-desc"
        useDeleteConfirmation={true}
      />,
    );

    const editButton = wrapper.find('.del-button');

    editButton
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<{}, MouseEvent>);

    const confirmationDialog = wrapper.find(ConfirmationPopover);

    expect(confirmationDialog).toHaveLength(1);

    expect(confirmationDialog.props().anchorEl).toBeDefined();

    confirmationDialog.props().onConfirm();

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('should handle delete without confirmation', () => {
    const wrapper = shallow(
      <ListItem
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        index={0}
        item={item}
        title="item-desc"
      />,
    );

    const deleteButton = wrapper.find('.del-button');

    deleteButton
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<{}, MouseEvent>);

    const confirmationDialog = wrapper.find(ConfirmationPopover);

    expect(confirmationDialog).toHaveLength(0);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('should handle check box click', () => {
    const checkMock = jest.fn();
    const wrapper = shallow(
      <ListItem
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        index={0}
        item={item}
        title="item-desc"
        onCheckBoxClick={checkMock}
      />,
    );
    const checkBoxButton = wrapper.find('.check-box');

    expect(wrapper.find(CheckBox)).toHaveLength(1);

    checkBoxButton
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<{}, MouseEvent>);

    expect(wrapper.find(CheckBox)).toHaveLength(1);
  });

  it('should show checked checkbox', () => {
    const checkMock = jest.fn();
    const wrapper = shallow(
      <ListItem
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        index={0}
        item={item}
        title="item-desc"
        onCheckBoxClick={checkMock}
        checked={true}
      />,
    );

    expect(wrapper.find(CheckBoxChecked)).toHaveLength(1);
  });
});
