import {
  dispatchMock,
  useActionContext,
} from '../../../../__test_helper__/manual-mocks/store/action/context';
import { ActionSetEditor } from '../ActionSetEditor';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionToolbar } from '../../actions/ActionToolbar';
import { getActionSchemaData } from '../../../../__test_helper__';
import { Snackbar } from '../../common';
import { StoryAction } from '../../../typings';

jest.mock('../../../hooks/use-action-schema-loader', () => ({
  useActionSchemaLoader: () => {
    return { loading: false };
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
}));

jest.mock('nanoid', () => ({
  nanoid: () => {
    return 'action-id';
  },
}));

describe('ActionSetEditor', () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  afterEach(() => {
    onCloseMock.mockClear();
    onSaveMock.mockClear();
    dispatchMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
    );
    expect(wrapper).toBeTruthy();
    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'clearActionExpansion' },
    ]);
  });

  it('should handle add action call', () => {
    const wrapper = shallow(
      <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
    );

    wrapper.find(ActionToolbar).props().onAddAction('click');

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

  it('should handle save description', () => {
    const wrapper = shallow(
      <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
    );

    wrapper.find(ActionToolbar).props().onDescriptionChange('click');

    expect(dispatchMock).toHaveBeenCalledWith([
      { description: 'click', type: 'setEditorActionDescription' },
    ]);
  });

  it('should show required props message and close message', () => {
    const data = {
      actionSchema: getActionSchemaData(),
      editorActionSet: {
        actions: [
          {
            id: 'action-id',
            name: 'click',
          },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
    };

    useActionContext.mockReturnValueOnce(data);

    const wrapper = shallow(
      <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
    );

    wrapper.find(ActionToolbar).props().onSave();

    const snackbar = wrapper.find(Snackbar);

    expect(snackbar).toHaveLength(1);

    snackbar.props().onClose();

    expect(wrapper.find(Snackbar)).toHaveLength(0);
  });

  it('should save if pass validation', () => {
    const data = {
      actionSchema: getActionSchemaData(),
      editorActionSet: {
        actions: [
          {
            args: {
              selector: 'div',
            },
            id: 'action-id',
            name: 'click',
          },
        ] as StoryAction[],
        description: 'desc',
        id: 'action-set-id',
      },
    };

    useActionContext.mockReturnValueOnce(data);

    const wrapper = shallow(
      <ActionSetEditor onClose={onCloseMock} onSaved={onSaveMock} />,
    );

    wrapper.find(ActionToolbar).props().onSave();

    expect(onSaveMock).toHaveBeenCalled();
  });
});
