import {
  setActionOptionsMock,
  toggleSubtitleItemMock,
} from '../../../../manual-mocks/store/action/context';
import React from 'react';
import { ActionSchemaRenderer } from '../../../../../src/features/action-set/components/actions/ActionSchemaRenderer';
import { shallow } from 'enzyme';
import { getActionSchemaData } from '../../../../configs/action-schema';
import { MemoizedSchemaRenderer } from '../../../../../src/features/schema/components/index';
import { useEditorAction } from '../../../../../src/features/action-set/hooks/use-editor-action';

vi.mock(
  '../../../../../src/features/action-set/hooks/use-editor-action',
  async () => await import('../../hooks/__mocks__/use-editor-action'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () => await import('../../../../hooks/__mocks__/use-current-story-data'),
);

const defaultMockData = {
  args: { selector: 'html' },
  id: 'action-id',
  name: 'click',
};

vi.mocked(useEditorAction).mockImplementation(() => defaultMockData);

describe('ActionSchemaRenderer', () => {
  const schema = getActionSchemaData();

  beforeEach(() => {
    vi.clearAllMocks();
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
    vi.mocked(useEditorAction).mockImplementationOnce(() => undefined);
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

    expect(setActionOptionsMock).toHaveBeenCalledWith({
      actionId: 'action-id',
      actionSetId: 'action-set-id',
      objPath: 'opt.path',
      storyId: 'story-id',
      val: 1,
    });
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

    wrapper.find(MemoizedSchemaRenderer).props().onAppendValueToTitle?.('opt.path');

    expect(toggleSubtitleItemMock).toHaveBeenCalledWith({
      actionId: 'action-id',
      actionOptionPath: 'opt.path',
      actionSetId: 'action-set-id',
      storyId: 'story-id',
    });
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
      .shouldAppendToTitle?.('opt.path');

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

    wrapper.find(MemoizedSchemaRenderer).props().onSelectorChange?.('opt.path', 1);

    expect(setActionOptionsMock).toHaveBeenCalledWith({
      actionId: 'action-id',
      actionSetId: 'action-set-id',
      objPath: 'opt.path',
      storyId: 'story-id',
      val: 1,
    });
  });
});
