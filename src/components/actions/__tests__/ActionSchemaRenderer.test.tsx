import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import React from 'react';
import { ActionSchemaRenderer } from '../ActionSchemaRenderer';
import { shallow } from 'enzyme';
import { getActionSchemaData } from '../../../../__test_data__/action-schema';
import { MemoizedSchemaRenderer } from '../../schema';
import { useEditorAction } from '../../../hooks/use-editor-action';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../hooks/use-editor-action');
jest.mock('../../../hooks/use-current-story-data.ts');

const defaultMockData = {
  args: { selector: 'html' },
  id: 'action-id',
  name: 'click',
};

mocked(useEditorAction).mockImplementation(() => defaultMockData);

describe('ActionSchemaRenderer', () => {
  const schema = getActionSchemaData();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );
    expect(wrapper).toBeTruthy();
  });

  it('should not render until receive current editing actions data', () => {
    mocked(useEditorAction).mockImplementationOnce(() => undefined);
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );
    expect(wrapper.type()).toBe(null);
  });

  it('should dispatch change', () => {
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );

    wrapper.find(MemoizedSchemaRenderer).props().onChange('opt.path', 1);

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionId: 'action-id',
        actionSetId: 'action-set-id',
        objPath: 'opt.path',
        storyId: 'story-id',
        type: 'setActionOptions',
        val: 1,
      },
    ]);
  });

  it('should return value', () => {
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );

    const val = wrapper
      .find(MemoizedSchemaRenderer)
      .props()
      .getValue('selector', { type: 'string' });
    expect(val).toBe('html');
  });

  it('should handle onAppendValueToTitle', () => {
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );

    wrapper
      .find(MemoizedSchemaRenderer)
      .props()
      .onAppendValueToTitle('opt.path');

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionId: 'action-id',
        actionOptionPath: 'opt.path',
        actionSetId: 'action-set-id',
        storyId: 'story-id',
        type: 'toggleSubtitleItem',
      },
    ]);
  });

  it('should handle shouldAppendToTitle', () => {
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );

    const val = wrapper
      .find(MemoizedSchemaRenderer)
      .props()
      .shouldAppendToTitle('opt.path');

    expect(val).toBe(undefined);
  });

  it('should handle onSelectorChange', () => {
    const wrapper = shallow(
      <ActionSchemaRenderer
        schema={schema}
        actionId="action-id"
        actionSetId="action-set-id"
      />,
    );

    wrapper
      .find(MemoizedSchemaRenderer)
      .props()
      .onSelectorChange('opt.path', 1);

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionId: 'action-id',
        actionSetId: 'action-set-id',
        objPath: 'opt.path',
        storyId: 'story-id',
        type: 'setActionOptions',
        val: 1,
      },
    ]);
  });
});
