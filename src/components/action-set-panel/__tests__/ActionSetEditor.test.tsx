import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import { storyFileInfo } from '../../../../__test_data__/story-file-info';
import { ActionSetEditor } from '../ActionSetEditor';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionSet } from '../../../typings';
import { ActionSetEditorIcons } from '../ActionSetEditorIcons';
import { ListItemWrapper } from '../../common';

// import { getActionSchemaData } from '../../../../__test_data__';
// import { Snackbar } from '../../common';
// import { StoryAction, ActionSet } from '../../../typings';
// import { useActionContext } from '../../../store/actions/ActionContext';

jest.mock('../../../hooks/use-action-schema-loader', () => ({
  useActionSchemaLoader: () => {
    return { loading: false };
  },
}));

describe('ActionSetEditor', () => {
  const actionSet: ActionSet = storyFileInfo()['story-id'].actionSets[0];

  afterEach(() => {
    dispatchMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);
    expect(wrapper).toBeTruthy();
  });

  it('should handle add action call', () => {
    const wrapper = shallow(<ActionSetEditor actionSet={actionSet} />);

    const listWrapperProps = wrapper.find(ListItemWrapper).props().icons;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (listWrapperProps as any).props.onAddAction();

    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'clearActionExpansion' },
    ]);
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        action: { id: 'action-id', name: 'click' },
        type: 'addActionSetAction',
      },
    ]);
  });

  // it('should handle save description', () => {
  //   const wrapper = shallow(
  //     <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
  //   );

  //   wrapper.find(ActionToolbar).props().onDescriptionChange('click');

  //   expect(dispatchMock).toHaveBeenCalledWith([
  //     { description: 'click', type: 'setActionSetDescription' },
  //   ]);
  // });

  // it('should show required props message and close message', () => {
  //   const data = {
  //     actionSchema: getActionSchemaData(),
  //     editorActionSet: {
  //       actions: [
  //         {
  //           id: 'action-id',
  //           name: 'click',
  //         },
  //       ],
  //       description: 'desc',
  //       id: 'action-set-id',
  //     },
  //   };

  //   useActionContext.mockReturnValueOnce(data);

  //   const wrapper = shallow(
  //     <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
  //   );

  //   wrapper.find(ActionToolbar).props().onSave();

  //   const snackbar = wrapper.find(Snackbar);

  //   expect(snackbar).toHaveLength(1);

  //   snackbar.props().onClose();

  //   expect(wrapper.find(Snackbar)).toHaveLength(0);
  // });

  // it('should save if pass validation', () => {
  //   const data = {
  //     actionSchema: getActionSchemaData(),
  //     editorActionSet: {
  //       actions: [
  //         {
  //           args: {
  //             selector: 'div',
  //           },
  //           id: 'action-id',
  //           name: 'click',
  //         },
  //       ] as StoryAction[],
  //       description: 'desc',
  //       id: 'action-set-id',
  //     },
  //   };

  //   useActionContext.mockReturnValueOnce(data);

  //   const wrapper = shallow(
  //     <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
  //   );

  //   wrapper.find(ActionToolbar).props().onSave();

  //   expect(onSaveMock).toHaveBeenCalled();
  // });
});
