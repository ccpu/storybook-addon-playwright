import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import React from 'react';
import { ActionOptions } from '../ActionOptions';
import { mount } from 'enzyme';
import { ExpansionPanel, Chip, IconButton } from '@material-ui/core';
import { useEditorAction } from '../../../hooks/use-editor-action';

jest.mock('../../../hooks/use-editor-action', () => ({
  useEditorAction: jest.fn(),
}));

const defaultMockData = {
  args: { selector: 'html' },
  id: 'action-id',
  name: 'click',
};

describe('ActionOptions', () => {
  beforeEach(() => {
    dispatchMock.mockClear();

    (useEditorAction as jest.Mock).mockImplementation(() => defaultMockData);
  });

  it('should render', () => {
    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionName="click"
      />,
    );
    expect(wrapper.exists).toBeTruthy();
  });

  it('should display option value in title', () => {
    const mockData = {
      args: { selector: 'html' },
      id: 'action-id',
      name: 'click',
      subtitleItems: ['selector'],
    };

    (useEditorAction as jest.Mock).mockImplementation(() => mockData);

    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionName="click"
      />,
    );

    expect(wrapper.find(Chip)).toHaveLength(1);
  });

  it('should handle expanding panel', () => {
    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionName="click"
      />,
    );

    wrapper
      .find(ExpansionPanel)
      .props()
      .onChange({} as React.ChangeEvent<unknown>, true);

    expect(dispatchMock).toHaveBeenCalledWith([
      { actionId: 'action-id', type: 'toggleActionExpansion' },
    ]);
  });

  it('should handle delete action', () => {
    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionName="click"
      />,
    );

    wrapper
      .find(IconButton)
      .props()
      .onClick(({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown) as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(dispatchMock).toHaveBeenCalledWith([
      { actionId: 'action-id', type: 'deleteActionSetAction' },
    ]);
  });
});
