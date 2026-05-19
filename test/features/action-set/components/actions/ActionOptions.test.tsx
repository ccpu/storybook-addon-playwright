import {
  toggleActionExpansionMock,
  deleteActionSetActionMock,
} from '../../../../manual-mocks/store/action/context';
import React from 'react';
import { ActionOptions } from '../../../../../src/features/action-set/components/actions/ActionOptions';
import { mount } from 'enzyme';
import { Chip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import { IconButton } from '@storybook/components';
import { useEditorAction } from '../../../../../src/features/action-set/hooks/use-editor-action';

vi.mock('../../../../../src/features/action-set/hooks/use-editor-action', () => ({
  useEditorAction: vi.fn(),
}));

const defaultMockData = {
  args: { selector: 'html' },
  id: 'action-id',
  name: 'click',
};

describe('ActionOptions', () => {
  beforeEach(() => {
    toggleActionExpansionMock.mockClear();
    deleteActionSetActionMock.mockClear();

    (useEditorAction as Mock).mockImplementation(() => defaultMockData);
  });

  it('should render', () => {
    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionSetId="action-set-id"
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

    (useEditorAction as Mock).mockImplementation(() => mockData);

    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionName="click"
        actionSetId="action-set-id"
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
        actionSetId="action-set-id"
      />,
    );

    wrapper
      .find(Accordion)
      .props()
      .onChange?.({} as React.SyntheticEvent, true);

    expect(toggleActionExpansionMock).toHaveBeenCalledWith('action-id');
  });

  it('should handle delete action', () => {
    const wrapper = mount(
      <ActionOptions
        DragHandle={() => <div />}
        actionId="action-id"
        actionName="click"
        actionSetId="action-set-id"
      />,
    );

    wrapper
      .find(IconButton)
      .last()
      .props()
      .onClick?.({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(deleteActionSetActionMock).toHaveBeenCalledWith({
      actionId: 'action-id',
      actionSetId: 'action-set-id',
      storyId: 'story-id',
    });
  });
});
