import { storyFileInfo } from '../../../../configs/story-file-info';
import { ActionSetEditor } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetEditor';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionSet } from '../../../../../src/typings';
import { ActionSetEditorIconsProps } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetEditorIcons';
import {
  ListItemWrapper,
  InputDialog,
  Snackbar,
} from '../../../../../src/components/common';
import { useActionEditor } from '../../../../../src/features/action-set/hooks/use-action-editor';

vi.mock(
  '../../../../../src/features/action-set/hooks/use-action-editor',
  async () => await import('../../hooks/__mocks__/use-action-editor'),
);

vi.mock(
  '../../../../../src/features/schema/hooks/use-action-schema-loader',
  () => ({
    useActionSchemaLoader: () => {
      return { loading: false };
    },
  }),
);

const handleAddActionMock = vi.fn();
const handleDescriptionChangeMock = vi.fn();
vi.mocked(useActionEditor).mockImplementation(
  () =>
    ({
      handleAddAction: handleAddActionMock,
      handleDescriptionChange: handleDescriptionChangeMock,
    } as unknown as ReturnType<typeof useActionEditor>),
);

describe('ActionSetEditor', () => {
  const actionSet: ActionSet =
    storyFileInfo().stories['story-id'].actionSets[0];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle add action call', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const listWrapperProps = wrapper.find(ListItemWrapper).props().icons;

    (
      listWrapperProps as {
        props: ActionSetEditorIconsProps;
      }
    ).props.onAddAction('click actionSet');

    expect(handleAddActionMock).toHaveBeenCalledWith('click actionSet');
  });

  it('should handle actionSet  title', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const listWrapperProps = wrapper.find(ListItemWrapper).props().icons;

    (
      listWrapperProps as {
        props: ActionSetEditorIconsProps;
      }
    ).props.onEditTitle();

    const inputDialog = wrapper.find(InputDialog);
    expect(inputDialog.exists()).toBeTruthy();
    inputDialog.props().onSave('new-desc');

    expect(handleDescriptionChangeMock).toHaveBeenCalledWith('new-desc');
  });

  it('should handle validation results', () => {
    vi.mocked(useActionEditor).mockImplementation(
      () =>
        ({
          validationResult: [{ id: 'action-id', required: ['foo'] }],
        } as unknown as ReturnType<typeof useActionEditor>),
    );

    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const snackbar = wrapper.find(Snackbar);

    expect(snackbar.exists()).toBeTruthy();
  });
});
