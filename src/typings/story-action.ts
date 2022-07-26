import { Page } from 'playwright';
import { KnobType } from '@storybook/addon-knobs/dist/components/types';
export type StoryActionPosition = { x: number; y: number };

export type ControlTypes = KnobType;

export interface StoryAction<T = Page> {
  id: string;
  name: string;
  labe?: string;
  args?: { [key: string]: unknown };
  subtitleItems?: string[];
  run?: (page: T, selector: string) => Promise<void>;
}

export interface Stories {
  [storyId: string]: { actionSets: ActionSet[] };
}

export interface ActionSet {
  id: string;
  title: string;
  actions: StoryAction[];
  temp?: boolean;
}

export interface FavouriteActionSet extends ActionSet {
  visibleTo?: string;
}
