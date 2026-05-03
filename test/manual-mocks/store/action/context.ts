import { ActionSetState } from '../../../../src/features/action-set/store/action-set-store';

// Individual action spies
export const addActionSetListMock = vi.fn();
export const setScreenShotActionSetsMock = vi.fn();
export const addActionSetMock = vi.fn();
export const setCurrentActionSetsMock = vi.fn();
export const clearCurrentActionSetsMock = vi.fn();
export const deleteActionSetMock = vi.fn();
export const deleteTempActionSetsMock = vi.fn();
export const sortActionSetsMock = vi.fn();
export const toggleCurrentActionSetMock = vi.fn();
export const toggleActionExpansionMock = vi.fn();
export const clearActionExpansionMock = vi.fn();
export const setActionSchemaMock = vi.fn();
export const cancelEditActionSetMock = vi.fn();
export const editActionSetMock = vi.fn();
export const setActionSetTitleMock = vi.fn();
export const addActionSetActionMock = vi.fn();
export const toggleSubtitleItemMock = vi.fn();
export const moveActionSetActionMock = vi.fn();
export const deleteActionSetActionMock = vi.fn();
export const setActionOptionsMock = vi.fn();
export const saveActionSetMock = vi.fn();

// Legacy dispatchMock - catches all calls for backwards compat
export const dispatchMock = vi.fn();

vi.mock('../../../../src/features/action-set/store/actions', () => ({
  addActionSet: (...args: any[]) => {
    addActionSetMock(...args);
    dispatchMock(args);
  },
  addActionSetAction: (...args: any[]) => {
    addActionSetActionMock(...args);
    dispatchMock(args);
  },
  addActionSetList: (...args: any[]) => {
    addActionSetListMock(...args);
    dispatchMock(args);
  },
  cancelEditActionSet: (...args: any[]) => {
    cancelEditActionSetMock(...args);
    dispatchMock(args);
  },
  clearActionExpansion: (...args: any[]) => {
    clearActionExpansionMock(...args);
    dispatchMock(args);
  },
  clearCurrentActionSets: (...args: any[]) => {
    clearCurrentActionSetsMock(...args);
    dispatchMock(args);
  },
  deleteActionSet: (...args: any[]) => {
    deleteActionSetMock(...args);
    dispatchMock(args);
  },
  deleteActionSetAction: (...args: any[]) => {
    deleteActionSetActionMock(...args);
    dispatchMock(args);
  },
  deleteTempActionSets: (...args: any[]) => {
    deleteTempActionSetsMock(...args);
    dispatchMock(args);
  },
  editActionSet: (...args: any[]) => {
    editActionSetMock(...args);
    dispatchMock(args);
  },
  moveActionSetAction: (...args: any[]) => {
    moveActionSetActionMock(...args);
    dispatchMock(args);
  },
  saveActionSet: (...args: any[]) => {
    saveActionSetMock(...args);
    dispatchMock(args);
  },
  setActionOptions: (...args: any[]) => {
    setActionOptionsMock(...args);
    dispatchMock(args);
  },
  setActionSchema: (...args: any[]) => {
    setActionSchemaMock(...args);
    dispatchMock(args);
  },
  setActionSetTitle: (...args: any[]) => {
    setActionSetTitleMock(...args);
    dispatchMock(args);
  },
  setCurrentActionSets: (...args: any[]) => {
    setCurrentActionSetsMock(...args);
    dispatchMock(args);
  },
  setScreenShotActionSets: (...args: any[]) => {
    setScreenShotActionSetsMock(...args);
    dispatchMock(args);
  },
  sortActionSets: (...args: any[]) => {
    sortActionSetsMock(...args);
    dispatchMock(args);
  },
  toggleActionExpansion: (...args: any[]) => {
    toggleActionExpansionMock(...args);
    dispatchMock(args);
  },
  toggleCurrentActionSet: (...args: any[]) => {
    toggleCurrentActionSetMock(...args);
    dispatchMock(args);
  },
  toggleSubtitleItem: (...args: any[]) => {
    toggleSubtitleItemMock(...args);
    dispatchMock(args);
  },
}));

vi.mock('../../../../src/features/action-set/store/selectors', async () => {
  const mock = await import(
    '../../../features/action-set/store/__mocks__/ActionContext'
  );
  return {
    ...mock,
  };
});

export { ActionSetState };
