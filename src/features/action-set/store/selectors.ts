import type { ActionSetState } from './action-set-store';
import { useActionSetStore } from './action-set-store';

export function getActionSetState(): ActionSetState {
  return useActionSetStore.getState();
}

export function useActionSchema() {
  return useActionSetStore((s) => s.actionSchema);
}

export function useExpandedActions() {
  return useActionSetStore((s) => s.expandedActions);
}

export function useStories() {
  return useActionSetStore((s) => s.stories);
}

export function useCurrentActionSetIds() {
  return useActionSetStore((s) => s.currentActionSets);
}

export function useOrgEditingActionSet() {
  return useActionSetStore((s) => s.orgEditingActionSet);
}

export function useInitialised() {
  return useActionSetStore((s) => s.initialised);
}

export function useActionSetStoreState() {
  return useActionSetStore();
}
