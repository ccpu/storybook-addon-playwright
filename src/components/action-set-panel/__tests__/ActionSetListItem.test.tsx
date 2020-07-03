import { ActionSetListItem } from '../ActionSetListItem';
import { shallow } from 'enzyme';
import React from 'react';
import { DeleteConfirmationButton, CheckBox } from '../../common';

describe('ActionSetListItem', () => {
  const deleteMock = jest.fn();
  const editMock = jest.fn();
  const onCheckMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
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

    wrapper
      .find('.edit-button')
      .props()
      .onClick({} as React.MouseEvent<unknown, MouseEvent>);

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

    wrapper.find(DeleteConfirmationButton).props().onDelete();

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

    wrapper.find(CheckBox).props().onClick();

    expect(onCheckMock).toHaveBeenCalledTimes(1);
  });
});
