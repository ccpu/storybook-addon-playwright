import { create } from 'zustand';
import {
  ActionSchemaList,
  PlaywrightDataStories,
  ActionSet,
} from '../../../typings';

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

export const useActionSetStore = create<ActionSetState>(() => ({
  ...initialActionSetState,
}));
