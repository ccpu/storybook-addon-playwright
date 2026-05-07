import { ActionSetState } from '../../../../src/features/action-set/store/action-set-store';

// Individual action spies
export const addActionSetListMock = vi.fn<(...args: unknown[]) => unknown>();
export const setScreenShotActionSetsMock = vi.fn<(...args: unknown[]) => unknown>();
export const addActionSetMock = vi.fn<(...args: unknown[]) => unknown>();
export const setCurrentActionSetsMock = vi.fn<(...args: unknown[]) => unknown>();
export const clearCurrentActionSetsMock = vi.fn<(...args: unknown[]) => unknown>();
export const deleteActionSetMock = vi.fn<(...args: unknown[]) => unknown>();
export const deleteTempActionSetsMock = vi.fn<(...args: unknown[]) => unknown>();
export const sortActionSetsMock = vi.fn<(...args: unknown[]) => unknown>();
export const toggleCurrentActionSetMock = vi.fn<(...args: unknown[]) => unknown>();
export const toggleActionExpansionMock = vi.fn<(...args: unknown[]) => unknown>();
export const clearActionExpansionMock = vi.fn<(...args: unknown[]) => unknown>();
export const setActionSchemaMock = vi.fn<(...args: unknown[]) => unknown>();
export const cancelEditActionSetMock = vi.fn<(...args: unknown[]) => unknown>();
export const editActionSetMock = vi.fn<(...args: unknown[]) => unknown>();
export const setActionSetTitleMock = vi.fn<(...args: unknown[]) => unknown>();
export const addActionSetActionMock = vi.fn<(...args: unknown[]) => unknown>();
export const toggleSubtitleItemMock = vi.fn<(...args: unknown[]) => unknown>();
export const moveActionSetActionMock = vi.fn<(...args: unknown[]) => unknown>();
export const deleteActionSetActionMock = vi.fn<(...args: unknown[]) => unknown>();
export const setActionOptionsMock = vi.fn<(...args: unknown[]) => unknown>();
export const saveActionSetMock = vi.fn<(...args: unknown[]) => unknown>();

// Legacy dispatchMock - catches all calls for backwards compat
export const dispatchMock = vi.fn<(...args: unknown[]) => unknown>();

vi.mock('../../../../src/features/action-set/store/actions', () => ({
  addActionSet: (...args: unknown[]) => {
    addActionSetMock(...args);
    dispatchMock(args);
  },
  addActionSetAction: (...args: unknown[]) => {
    addActionSetActionMock(...args);
    dispatchMock(args);
  },
  addActionSetList: (...args: unknown[]) => {
    addActionSetListMock(...args);
    dispatchMock(args);
  },
  cancelEditActionSet: (...args: unknown[]) => {
    cancelEditActionSetMock(...args);
    dispatchMock(args);
  },
  clearActionExpansion: (...args: unknown[]) => {
    clearActionExpansionMock(...args);
    dispatchMock(args);
  },
  clearCurrentActionSets: (...args: unknown[]) => {
    clearCurrentActionSetsMock(...args);
    dispatchMock(args);
  },
  deleteActionSet: (...args: unknown[]) => {
    deleteActionSetMock(...args);
    dispatchMock(args);
  },
  deleteActionSetAction: (...args: unknown[]) => {
    deleteActionSetActionMock(...args);
    dispatchMock(args);
  },
  deleteTempActionSets: (...args: unknown[]) => {
    deleteTempActionSetsMock(...args);
    dispatchMock(args);
  },
  editActionSet: (...args: unknown[]) => {
    editActionSetMock(...args);
    dispatchMock(args);
  },
  moveActionSetAction: (...args: unknown[]) => {
    moveActionSetActionMock(...args);
    dispatchMock(args);
  },
  saveActionSet: (...args: unknown[]) => {
    saveActionSetMock(...args);
    dispatchMock(args);
  },
  setActionOptions: (...args: unknown[]) => {
    setActionOptionsMock(...args);
    dispatchMock(args);
  },
  setActionSchema: (...args: unknown[]) => {
    setActionSchemaMock(...args);
    dispatchMock(args);
  },
  setActionSetTitle: (...args: unknown[]) => {
    setActionSetTitleMock(...args);
    dispatchMock(args);
  },
  setCurrentActionSets: (...args: unknown[]) => {
    setCurrentActionSetsMock(...args);
    dispatchMock(args);
  },
  setScreenShotActionSets: (...args: unknown[]) => {
    setScreenShotActionSetsMock(...args);
    dispatchMock(args);
  },
  sortActionSets: (...args: unknown[]) => {
    sortActionSetsMock(...args);
    dispatchMock(args);
  },
  toggleActionExpansion: (...args: unknown[]) => {
    toggleActionExpansionMock(...args);
    dispatchMock(args);
  },
  toggleCurrentActionSet: (...args: unknown[]) => {
    toggleCurrentActionSetMock(...args);
    dispatchMock(args);
  },
  toggleSubtitleItem: (...args: unknown[]) => {
    toggleSubtitleItemMock(...args);
    dispatchMock(args);
  },
}));

vi.mock('../../../../src/features/action-set/store/selectors', async () => {
  const mock = await import('../../../features/action-set/store/__mocks__/ActionContext');
  return {
    ...mock,
  };
});

export { ActionSetState };
