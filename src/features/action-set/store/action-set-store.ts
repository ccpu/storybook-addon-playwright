import type {
  ActionSchemaList,
  ActionSet,
  PlaywrightDataStories,
} from '../../../typings';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ActionSetState {
  actionSchema: ActionSchemaList;
  expandedActions: { [k: string]: boolean };
  stories: PlaywrightDataStories;
  initialised: boolean;
  currentActionSets: string[];
  orgEditingActionSet?: ActionSet & { isNew?: boolean };
}

export const initialActionSetState: ActionSetState = {
  actionSchema: {},
  currentActionSets: [],
  expandedActions: {},
  initialised: true,
  stories: {},
};

export const useActionSetStore = create<ActionSetState>()(
  devtools(
    () => ({
      ...initialActionSetState,
    }),
    { name: 'action-set-store' },
  ),
);
