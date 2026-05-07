import {
  useActionSetStore,
  initialActionSetState,
} from '../../../../src/features/action-set/store/action-set-store';
import {
  addActionSetList,
  setScreenShotActionSets,
  addActionSet,
  setCurrentActionSets,
  clearCurrentActionSets,
  deleteActionSet,
  deleteTempActionSets,
  sortActionSets,
  toggleCurrentActionSet,
  toggleActionExpansion,
  clearActionExpansion,
  setActionSchema,
  cancelEditActionSet,
  editActionSet,
  setActionSetTitle,
  addActionSetAction,
  toggleSubtitleItem,
  moveActionSetAction,
  deleteActionSetAction,
  setActionOptions,
  saveActionSet,
} from '../../../../src/features/action-set/store/actions';
import { ActionSet, PlaywrightDataStories } from '../../../../src/typings';

describe('action-set zustand store', () => {
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

  const getStoryData = (
    sId = storyId,
    data?: Partial<ActionSet>,
  ): PlaywrightDataStories => ({
    [sId]: {
      actionSets: [getActionSetData(data)],
    },
  });

  beforeEach(() => {
    useActionSetStore.setState({ ...initialActionSetState });
  });

  it('should have initial state', () => {
    expect(useActionSetStore.getState()).toStrictEqual({
      actionSchema: {},
      currentActionSets: [],
      expandedActions: {},
      initialised: true,
      stories: {},
    });
  });

  it('should addActionSetList', () => {
    addActionSetList({ actionSets: [getActionSetData()], storyId });
    const state = useActionSetStore.getState();
    expect(state.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should remove old and add addActionSet', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    addActionSet({ actionSet: getActionSetData(), selected: false, storyId });
    const state = useActionSetStore.getState();
    expect(state.stories[storyId].actionSets).toHaveLength(1);
    expect(state.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should add new action-set addActionSet', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    addActionSet({
      actionSet: getActionSetData({ id: 'action-set-id-2' }),
      isNew: true,
      selected: true,
      storyId,
    });
    const state = useActionSetStore.getState();
    expect(state.stories[storyId].actionSets).toHaveLength(2);
    expect(state.currentActionSets).toStrictEqual(['action-set-id-2']);
    expect(state.stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id-2',
        title: 'desc',
      },
    ]);
  });

  it('should clearCurrentActionSets', () => {
    useActionSetStore.setState({ currentActionSets: ['1'] });
    clearCurrentActionSets();
    expect(useActionSetStore.getState().currentActionSets).toStrictEqual([]);
  });

  it('should deleteActionSet', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    deleteActionSet({ actionSetId: 'action-set-id', storyId });
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([]);
  });

  it('should sortActionSets', () => {
    useActionSetStore.setState({
      stories: {
        [storyId]: {
          actionSets: [getActionSetData(), getActionSetData({ id: 'action-set-id-2' })],
        },
      },
    });
    sortActionSets({ newIndex: 1, oldIndex: 0, storyId });
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id-2',
        title: 'desc',
      },
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should toggleCurrentActionSet add/remove', () => {
    useActionSetStore.setState({ currentActionSets: ['action-set-id'] });
    toggleCurrentActionSet('action-set-id');
    expect(useActionSetStore.getState().currentActionSets).toStrictEqual([]);
    toggleCurrentActionSet('action-set-id');
    expect(useActionSetStore.getState().currentActionSets).toStrictEqual([
      'action-set-id',
    ]);
  });

  it('should toggleActionExpansion add/remove', () => {
    useActionSetStore.setState({ expandedActions: {} });
    toggleActionExpansion('action-id');
    expect(useActionSetStore.getState().expandedActions).toStrictEqual({
      'action-id': true,
    });
    toggleActionExpansion('action-id');
    expect(useActionSetStore.getState().expandedActions).toStrictEqual({
      'action-id': false,
    });
  });

  it('should clearActionExpansion', () => {
    useActionSetStore.setState({ expandedActions: { 'action-id': true } });
    clearActionExpansion();
    expect(useActionSetStore.getState().expandedActions).toStrictEqual({});
  });

  it('should setActionSchema', () => {
    setActionSchema({ 'action-schema': { name: 'schema-name' } });
    expect(useActionSetStore.getState().actionSchema).toStrictEqual({
      'action-schema': { name: 'schema-name' },
    });
  });

  it('should setActionSetTitle', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    setActionSetTitle({
      actionSetId: 'action-set-id',
      storyId,
      title: 'desc-2',
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].title,
    ).toStrictEqual('desc-2');
  });

  it('should saveActionSet', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    saveActionSet();
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should toggleSubtitleItem (add)', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    toggleSubtitleItem({
      actionId: 'action-id',
      actionOptionPath: 'selector',
      actionSetId: 'action-set-id',
      storyId,
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].actions[0],
    ).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
      subtitleItems: ['selector'],
    });
  });

  it('should toggleSubtitleItem (remove)', () => {
    const stories = getStoryData();
    useActionSetStore.setState({
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
    });
    toggleSubtitleItem({
      actionId: 'action-id',
      actionOptionPath: 'selector',
      actionSetId: 'action-set-id',
      storyId,
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].actions[0],
    ).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
      subtitleItems: [],
    });
  });

  it('should moveActionSetAction', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    moveActionSetAction({
      actionSetId: 'action-set-id',
      newIndex: 0,
      oldIndex: 1,
      storyId,
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].actions,
    ).toStrictEqual([
      { id: 'action-id-2', name: 'action-name-2' },
      { id: 'action-id', name: 'action-name' },
    ]);
  });

  it('should deleteActionSetAction', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    deleteActionSetAction({
      actionId: 'action-id',
      actionSetId: 'action-set-id',
      storyId,
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].actions,
    ).toStrictEqual([{ id: 'action-id-2', name: 'action-name-2' }]);
  });

  it('should addActionSetAction', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    addActionSetAction({
      action: { id: 'action-id-3', name: 'action-name' },
      actionSetId: 'action-set-id',
      storyId,
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].actions,
    ).toStrictEqual([
      { id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
      { id: 'action-id-3', name: 'action-name' },
    ]);
  });

  it('should setActionOptions', () => {
    useActionSetStore.setState({ stories: getStoryData() });
    setActionOptions({
      actionId: 'action-id',
      actionSetId: 'action-set-id',
      objPath: 'selector',
      storyId,
      val: 'div',
    });
    expect(
      useActionSetStore.getState().stories[storyId].actionSets![0].actions,
    ).toStrictEqual([
      { args: { selector: 'div' }, id: 'action-id', name: 'action-name' },
      { id: 'action-id-2', name: 'action-name-2' },
    ]);
  });

  it('should cancelEditActionSet (remove if new action-set)', () => {
    const stories = getStoryData();
    const newActionSet: ActionSet = {
      actions: [],
      id: 'action-set-id-3',
      title: 'action-set-desc',
    };
    useActionSetStore.setState({
      orgEditingActionSet: {
        ...newActionSet,
        isNew: true,
      },
      stories: {
        ...stories,
        [storyId]: { ...stories[storyId], actionSets: [newActionSet] },
      },
    });
    cancelEditActionSet(storyId);
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([]);
  });

  it('should cancelEditActionSet (revert change if editing existing action-set)', () => {
    const stories = getStoryData();
    useActionSetStore.setState({
      orgEditingActionSet: getActionSetData(),
      stories: {
        ...stories,
        [storyId]: {
          ...stories[storyId],
          actionSets: [getActionSetData({ title: 'changed-desc' })],
        },
      },
    });
    cancelEditActionSet(storyId);
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should do nothing when calling cancelEditActionSet but orgEditingActionSet is undefined', () => {
    useActionSetStore.setState({
      orgEditingActionSet: undefined,
      stories: getStoryData(),
    });
    cancelEditActionSet(storyId);
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should set currentActionSets and orgEditingActionSet when using editActionSet', () => {
    useActionSetStore.setState({
      currentActionSets: [],
      stories: getStoryData(),
    });
    editActionSet(getActionSetData());
    const state = useActionSetStore.getState();
    expect(state.orgEditingActionSet).toStrictEqual({
      actions: [
        { id: 'action-id', name: 'action-name' },
        { id: 'action-id-2', name: 'action-name-2' },
      ],
      id: 'action-set-id',
      title: 'desc',
    });
    expect(state.currentActionSets).toStrictEqual(['action-set-id']);
  });

  it('should deleteTempActionSets', () => {
    useActionSetStore.setState({
      stories: getStoryData(storyId, { temp: true }),
    });
    deleteTempActionSets(storyId);
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([]);
  });

  it('should setCurrentActionSets', () => {
    useActionSetStore.setState({
      stories: getStoryData(storyId, { temp: true }),
    });
    setCurrentActionSets(['id-1']);
    expect(useActionSetStore.getState().currentActionSets).toStrictEqual(['id-1']);
  });

  it('should setScreenShotActionSets but use existing action set', () => {
    useActionSetStore.setState({
      stories: getStoryData(storyId),
    });
    const { id: _actionSetId, actions, ...actionSet } = getActionSetData();
    setScreenShotActionSets({
      actionSets: [{ ...actionSet, actions, id: _actionSetId }],
      storyId,
    });
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: 'action-set-id',
        title: 'desc',
      },
    ]);
  });

  it('should setScreenShotActionSets copy action sets', () => {
    useActionSetStore.setState({
      stories: {
        [storyId]: {
          actionSets: [getActionSetData({ id: '1' }), getActionSetData({ id: '2' })],
        },
      },
    });
    setScreenShotActionSets({
      actionSets: [getActionSetData({ id: '1' }), getActionSetData({ id: '2' })],
      storyId,
    });
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: '1',
        title: 'desc',
      },
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: '2',
        title: 'desc',
      },
    ]);
  });

  it('should setScreenShotActionSets create new actionSet', () => {
    useActionSetStore.setState({
      stories: {
        [storyId]: {
          actionSets: [getActionSetData({ id: '1' })],
        },
      },
    });
    setScreenShotActionSets({
      actionSets: [
        getActionSetData({
          actions: [{ id: 'action-id', name: 'dbClick' }],
          id: '2',
        }),
      ],
      storyId,
    });
    expect(useActionSetStore.getState().stories[storyId].actionSets).toStrictEqual([
      {
        actions: [{ id: 'id-1', name: 'dbClick' }],
        id: 'id-2',
        temp: true,
        title: 'desc',
      },
      {
        actions: [
          { id: 'action-id', name: 'action-name' },
          { id: 'action-id-2', name: 'action-name-2' },
        ],
        id: '1',
        title: 'desc',
      },
    ]);
  });
});
