import { storyFileInfo } from '../../../../__test_data__/story-file-info';
import { ActionSetEditor } from '../ActionSetEditor';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionSet } from '../../../typings';
import { ActionSetEditorIconsProps } from '../ActionSetEditorIcons';
import { ListItemWrapper, InputDialog, Snackbar } from '../../common';
import { useActionEditor } from '../../../hooks/use-action-editor';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../hooks/use-action-editor');

jest.mock('../../../hooks/use-action-schema-loader', () => ({
  useActionSchemaLoader: () => {
    return { loading: false };
  },
}));

const handleAddActionMock = jest.fn();
const handleDescriptionChangeMock = jest.fn();
mocked(useActionEditor).mockImplementation(
  () =>
    (({
      handleAddAction: handleAddActionMock,
      handleDescriptionChange: handleDescriptionChangeMock,
    } as unknown) as ReturnType<typeof useActionEditor>),
);

describe('ActionSetEditor', () => {
  const actionSet: ActionSet = storyFileInfo()['story-id'].actionSets[0];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle add action call', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const listWrapperProps = wrapper.find(ListItemWrapper).props().icons;

    (listWrapperProps as {
      props: ActionSetEditorIconsProps;
    }).props.onAddAction('click actionSet');

    expect(handleAddActionMock).toHaveBeenCalledWith('click actionSet');
  });

  it('should handle actionSet  description', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const listWrapperProps = wrapper.find(ListItemWrapper).props().icons;

    (listWrapperProps as {
      props: ActionSetEditorIconsProps;
    }).props.onEditDescription();

    const inputDialog = wrapper.find(InputDialog);
    expect(inputDialog.exists()).toBeTruthy();
    inputDialog.props().onSave('new-desc');

    expect(handleDescriptionChangeMock).toHaveBeenCalledWith('new-desc');
  });

  it('should handle validation results', () => {
    mocked(useActionEditor).mockImplementation(
      () =>
        (({
          validationResult: [{ id: 'action-id', required: ['foo'] }],
        } as unknown) as ReturnType<typeof useActionEditor>),
    );

    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const snackbar = wrapper.find(Snackbar);

    expect(snackbar.exists()).toBeTruthy();
  });
});
