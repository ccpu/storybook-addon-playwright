import { useCurrentActions as orgUseCurrentActions } from '../../../../../src/features/action-set/hooks/use-current-actions';

export const useCurrentActions = vi.fn<typeof orgUseCurrentActions>().mockReturnValue({
  currentActions: [],
  state: { currentActionSets: [], initialised: false, stories: {} },
} as unknown as ReturnType<typeof orgUseCurrentActions>);
