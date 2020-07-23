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
    description: 'desc',
    id: 'action-set-id',
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

  it('should add new action-set addActionSet', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionSet: getActionSetData({ id: 'action-set-id-2' }),
        new: true,
        selected: true,
        storyId: storyId,
        type: 'addActionSet',
      },
    );
    expect(result.stories[storyId].actionSets).toHaveLength(2);
    expect(result.currentActionSets).toStrictEqual(['action-set-id-2']);
    expect(result.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id',
      },
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        description: 'desc',
        id: 'action-set-id-2',
      },
    ]);
  });

  it('should add new temporary action-set addActionSet', () => {
    const result = reducer(
      { currentActionSets: ['action-set-id-5'], stories: getStoryData() },
      {
        actionSet: getActionSetData({ id: 'action-set-id-2', temp: true }),
        new: true,
        selected: true,
        storyId: storyId,
        type: 'addActionSet',
      },
    );
    expect(result.stories[storyId].actionSets).toHaveLength(2);
    expect(result.currentActionSets).toStrictEqual(['action-set-id-2']);
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

  it('should deleteActionSet and clear currentActionSets', () => {
    const result2 = reducer(
      {
        currentActionSets: ['action-set-id', 'action-set-id-2'],
        stories: { [storyId]: { actionSets: [getActionSetData()] } },
      },
      {
        actionSetId: 'action-set-id',
        clearCurrentActionSets: true,
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

  it('should setActionSetDescription', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionSetId: 'action-set-id',
        description: 'desc-2',
        storyId,
        type: 'setActionSetDescription',
      },
    );
    expect(result.stories[storyId].actionSets[0].description).toStrictEqual(
      'desc-2',
    );
  });

  it('should saveActionSet (add)', () => {
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
      { stories: getStoryData() },
      {
        actionId: 'action-id',
        actionOptionPath: 'selector',
        actionSetId: 'action-set-id',
        storyId,
        type: 'toggleSubtitleItem',
      },
    );
    expect(result.stories[storyId].actionSets[0].actions[0]).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
      subtitleItems: ['selector'],
    });
  });

  it('should toggleSubtitleItem (remove)', () => {
    const stories = getStoryData();
    const result = reducer(
      {
        stories: {
          ...stories,
          [storyId]: {
            ...stories[storyId],
            actionSets: [
              getActionSetData({
                actions: [
                  {
                    id: 'action-id',
                    name: 'action-name',
                    subtitleItems: ['selector'],
                  },
                ],
              }),
            ],
          },
        },
      },
      {
        actionId: 'action-id',
        actionOptionPath: 'selector',
        actionSetId: 'action-set-id',
        storyId,
        type: 'toggleSubtitleItem',
      },
    );
    expect(result.stories[storyId].actionSets[0].actions[0]).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
      subtitleItems: [],
    });
  });

  it('should moveActionSetAction', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionSetId: 'action-set-id',
        newIndex: 0,
        oldIndex: 1,
        storyId,
        type: 'moveActionSetAction',
      },
    );
    expect(result.stories[storyId].actionSets[0].actions).toStrictEqual([
      { id: 'action-id-2', name: 'action-name-2' },
      { id: 'action-id', name: 'action-name' },
    ]);
  });

  it('should deleteActionSetAction', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionId: 'action-id',
        actionSetId: 'action-set-id',
        storyId,
        type: 'deleteActionSetAction',
      },
    );
    expect(result.stories[storyId].actionSets[0].actions).toStrictEqual([
      { id: 'action-id-2', name: 'action-name-2' },
    ]);
  });

  it('should addActionSetAction', () => {
    const result = reducer(
      { stories: getStoryData() },

      {
        action: { id: 'action-id-3', name: 'action-name' },
        actionSetId: 'action-set-id',
        storyId,
        type: 'addActionSetAction',
      },
    );
    expect(result.stories[storyId].actionSets[0].actions).toStrictEqual([
      { id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
      { id: 'action-id-3', name: 'action-name' },
    ]);
  });

  it('should setActionOptions', () => {
    const result = reducer(
      { stories: getStoryData() },
      {
        actionId: 'action-id',
        actionSetId: 'action-set-id',
        objPath: 'selector',
        storyId,
        type: 'setActionOptions',
        val: 'div',
      },
    );
    expect(result.stories[storyId].actionSets[0].actions).toStrictEqual([
      { args: { selector: 'div' }, id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
    ]);
  });

  it('should cancelEditActionSet (remove if new action-set)', () => {
    const stories = getStoryData();

    const newActionSet: ActionSet = {
      actions: [],
      description: 'action-set-desc',
      id: 'action-set-id-3',
    };

    const result = reducer(
      {
        orgEditingActionSet: {
          ...newActionSet,
          isNew: true,
        },
        stories: {
          ...stories,
          [storyId]: { ...stories[storyId], actionSets: [newActionSet] },
        },
      },
      {
        storyId,
        type: 'cancelEditActionSet',
      },
    );
    expect(result.stories[storyId].actionSets).toStrictEqual([]);
  });

  it('should cancelEditActionSet (revert change if editing existing action-set)', () => {
    const stories = getStoryData();

    const result = reducer(
      {
        orgEditingActionSet: getActionSetData(),
        stories: {
          ...stories,
          [storyId]: {
            ...stories[storyId],
            actionSets: [getActionSetData({ description: 'changed-desc' })],
          },
        },
      },
      {
        storyId,
        type: 'cancelEditActionSet',
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

  it('should do nothing when calling cancelEditActionSet but orgEditingActionSet is undefined', () => {
    const result = reducer(
      {
        orgEditingActionSet: undefined,
        stories: getStoryData(),
      },
      {
        storyId,
        type: 'cancelEditActionSet',
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

  it('should set currentActionSets and orgEditingActionSet when using editActionSet', () => {
    const result = reducer(
      {
        currentActionSets: [],
        stories: getStoryData(),
      },
      {
        actionSet: getActionSetData(),
        type: 'editActionSet',
      },
    );
    expect(result.orgEditingActionSet).toStrictEqual({
      actions: [
        { id: 'action-id', name: 'action-name' },
        { id: 'action-id-2', name: 'action-name-2' },
      ],
      description: 'desc',
      id: 'action-set-id',
    });
    expect(result.currentActionSets).toStrictEqual(['action-set-id']);
  });
});
