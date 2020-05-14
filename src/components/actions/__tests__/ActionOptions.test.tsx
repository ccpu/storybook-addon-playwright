// import '../../../../__test_helper__/manual-mocks/store/action/context';
import React from 'react';
import { ActionOptions } from '../ActionOptions';
import { shallow } from 'enzyme';
import { StoryAction } from '../../../typings';
// import {useEditorAction} from '../../../hooks';
import { ActionProvider } from '../../../store/actions/ActionContext';

jest.mock('../../../hooks/use-editor-action', () => ({
  useEditorAction: (): StoryAction => ({
    id: 'action-id',
    name: 'action-name',
  }),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
}));

describe('ActionOptions', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionProvider>
        <ActionOptions
          DragHandle={() => <div />}
          actionId="action-id"
          actionName="click"
        />
      </ActionProvider>,
    );
    expect(wrapper.exists).toBeTruthy();
  });

  // it('should display option value in title', () => {
  //   (useEditorAction as jest.Mock).mockImplementationOnce({
  //     id: 'action-id',
  //     name: 'action-name',
  //   })
  //   const wrapper = shallow(
  //     <ActionOptions
  //       DragHandle={() => <div />}
  //       actionId="action-id"
  //       actionName="click"
  //     />,
  //   );
  //   expect(wrapper.exists).toBeTruthy();
  // });
});
