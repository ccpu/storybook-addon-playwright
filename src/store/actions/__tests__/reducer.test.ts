import { reducer as actionReducer, Action, ReducerState } from '../reducer';
import { ActionSet, Stories } from '../../../typings';

type Dispatch = (
  state?: Partial<ReducerState>,
  action?: Action,
) => ReducerState;

const reducer = actionReducer as Dispatch;

describe('action reducer', () => {
  const storyId = 'story-id';
  const getActionSetData = (data?: Partial<ActionSet>): ActionSet => ({
    actions: [
      { id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
    ],
    id: 'action-set-id',
    title: 'desc',
    ...data,
  });

  const getStoryData = (sId = storyId): Stories => ({
    [sId]: {
      actionSets: [getActionSetData()],
    },
  });

  it('should return initial state', () => {
    const result = reducer(undefined, {} as Action);
    expect(result).toStrictEqual({
      actionSchema: {},
      currentActionSets: [],
      expandedActions: {},
      initialised: true,
      stories: {},
    });
  });

  it('should addActionSetList', () => {
    const result = reducer(undefined, {
      actionSets: [getActionSetData()],
      storyId: storyId,
      type: 'addActionSetList',
    });
    expect(result.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
    ]);
  });

  it('should remove old and add addActionSet', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionSet: getActionSetData(),
        selected: false,
        storyId: storyId,
        type: 'addActionSet',
      },
    );
    expect(result.stories[storyId].actionSets).toHaveLength(1);
    expect(result.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
    ]);
  });

  it('should clearCurrentActionSets', () => {
    const result = reducer(
      { currentActionSets: ['1'] },
      {
        type: 'clearCurrentActionSets',
      },
    );
    expect(result.currentActionSets).toStrictEqual([]);
  });

  it('should deleteActionSet and also remove from currentActionSets', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionSetId: 'action-set-id',
        storyId: storyId,
        type: 'deleteActionSet',
      },
    );
    expect(result.stories[storyId].actionSets).toStrictEqual([]);

    const result2 = reducer(
      {
        currentActionSets: ['action-set-id'],
        stories: { [storyId]: { actionSets: [getActionSetData()] } },
      },
      {
        actionSetId: 'action-set-id',
        storyId: storyId,
        type: 'deleteActionSet',
      },
    );
    expect(result2.currentActionSets).toStrictEqual([]);
  });

  it('should sortActionSets', () => {
    const result = reducer(
      {
        stories: {
          [storyId]: {
            actionSets: [
              getActionSetData(),
              getActionSetData({ id: 'action-set-id-2' }),
            ],
          },
        },
      },
      {
        newIndex: 1,
        oldIndex: 0,
        storyId: storyId,
        type: 'sortActionSets',
      },
    );
    expect(result.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id-2',
      },
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
    ]);
  });

  it('should toggleCurrentActionSet add/remove', () => {
    const result = reducer(
      { currentActionSets: ['action-set-id'] },
      {
        actionSetId: 'action-set-id',
        type: 'toggleCurrentActionSet',
      },
    );
    expect(result.currentActionSets).toStrictEqual([]);
    const result2 = reducer(
      { currentActionSets: [] },
      {
        actionSetId: 'action-set-id',
        type: 'toggleCurrentActionSet',
      },
    );
    expect(result2.currentActionSets).toStrictEqual(['action-set-id']);
  });

  it('should toggleActionExpansion add/remove', () => {
    const result = reducer(
      { expandedActions: {} },
      {
        actionId: 'action-id',
        type: 'toggleActionExpansion',
      },
    );
    expect(result.expandedActions).toStrictEqual({ 'action-id': true });

    const result2 = reducer(
      { expandedActions: { 'action-id': true } },
      {
        actionId: 'action-id',
        type: 'toggleActionExpansion',
      },
    );
    expect(result2.expandedActions).toStrictEqual({ 'action-id': false });
  });

  it('should clearActionExpansion', () => {
    const result = reducer(
      { expandedActions: { 'action-id': true } },
      {
        type: 'clearActionExpansion',
      },
    );
    expect(result.expandedActions).toStrictEqual({});
  });

  it('should setActionSchema', () => {
    const result = reducer(undefined, {
      actionSchema: { 'action-schema': { name: 'schema-name' } },
      type: 'setActionSchema',
    });
    expect(result.actionSchema).toStrictEqual({
      'action-schema': { name: 'schema-name' },
    });
  });

  it('should clearEditorActionSet', () => {
    const result = reducer(
      { editorActionSet: getActionSetData() },
      {
        type: 'clearEditorActionSet',
      },
    );
    expect(result.editorActionSet).toStrictEqual(undefined);
  });

  it('should editorActionSet', () => {
    const result = reducer(
      { editorActionSet: undefined },
      {
        actionSet: getActionSetData(),
        type: 'editorActionSet',
      },
    );
    expect(result.editorActionSet).toStrictEqual(getActionSetData());
  });

  it('should setActionSetDescription', () => {
    const result = reducer(
      { editorActionSet: getActionSetData() },
      {
        title: 'desc-2',
        type: 'setActionSetDescription',
      },
    );
    expect(result.editorActionSet.title).toStrictEqual('desc-2');
  });

  it('should saveActionSet (add)', () => {
    const result = reducer(undefined, {
      actionSet: getActionSetData(),
      storyId: storyId,
      type: 'saveActionSet',
    });
    expect(result.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
    ]);
  });

  it('should saveActionSet (replace)', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionSet: getActionSetData(),
        storyId: storyId,
        type: 'saveActionSet',
      },
    );
    expect(result.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
    ]);
  });

  it('should toggleSubtitleItem (add)', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData({
          actions: [{ id: 'action-id', name: 'action-name' }],
        }),
      },
      {
        actionId: 'action-id',
        actionOptionPath: 'selector',
        type: 'toggleSubtitleItem',
      },
    );
    expect(result.editorActionSet.actions[0]).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
      subtitleItems: ['selector'],
    });
  });

  it('should toggleSubtitleItem (remove)', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData({
          actions: [
            {
              id: 'action-id',
              name: 'action-name',
              subtitleItems: ['selector'],
            },
          ],
        }),
      },
      {
        actionId: 'action-id',
        actionOptionPath: 'selector',
        type: 'toggleSubtitleItem',
      },
    );
    expect(result.editorActionSet.actions[0]).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
      subtitleItems: [],
    });
  });
  it('should toggleSubtitleItem do nothing if not exist', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData(),
      },
      {
        actionId: 'action-id-3',
        actionOptionPath: 'selector',
        type: 'toggleSubtitleItem',
      },
    );
    expect(result.editorActionSet.actions[0]).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
    });
  });

  it('should moveActionSetAction', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData({ id: 'action-id-2' }),
      },
      {
        newIndex: 0,
        oldIndex: 1,
        type: 'moveActionSetAction',
      },
    );
    expect(result.editorActionSet.actions).toStrictEqual([
      { id: 'action-id-2', name: 'action-name-2' },
      { id: 'action-id', name: 'action-name' },
    ]);
  });

  it('should deleteActionSetAction', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData(),
      },
      {
        actionId: 'action-id',
        type: 'deleteActionSetAction',
      },
    );
    expect(result.editorActionSet.actions).toStrictEqual([
      { id: 'action-id-2', name: 'action-name-2' },
    ]);
  });

  it('should addActionSetAction', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData(),
      },
      {
        action: { id: 'action-id-3', name: 'action-name' },
        type: 'addActionSetAction',
      },
    );
    expect(result.editorActionSet.actions).toStrictEqual([
      { id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
      { id: 'action-id-3', name: 'action-name' },
    ]);
  });

  it('should setActionOptions', () => {
    const result = reducer(
      {
        editorActionSet: getActionSetData(),
      },
      {
        actionId: 'action-id',
        objPath: 'selector',
        type: 'setActionOptions',
        val: 'div',
      },
    );
    expect(result.editorActionSet.actions).toStrictEqual([
      { args: { selector: 'div' }, id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
    ]);
  });
});
