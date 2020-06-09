import { reducer as actionReducer } from '../reducer';
import { useActionDispatchContext } from '../ActionContext';

type Dispatch = ReturnType<typeof useActionDispatchContext>;

const reducer = actionReducer as Dispatch;

describe('action reducer', () => {
  it('should return initial state', () => {
    expect(
      reducer({
        actionSet: { actions: [], description: 'desc', id: 'action-id' },
        selected: false,
        storyId: 'story-id',
        type: 'addActionSet',
      }),
    ).toStrictEqual(null);
  });
});
