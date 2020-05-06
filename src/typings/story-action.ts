import { Page } from 'playwright-core';
import { KnobType } from '@storybook/addon-knobs/dist/components/types';
import { Definition } from 'ts-to-json';
export type StoryActionPosition = { x: number; y: number };

export type ActionSchema = Definition;

export type ControlTypes = KnobType;

export interface StoryAction<T extends unknown = Page> {
  id?: string;
  actionKey: string;
  storyId: string;
  labe?: string;
  actions?: unknown;
  subtitleItems?: string[];
  run?: (page: T, selector: string) => Promise<void>;
}

export type StoryActions<T extends unknown = Page> = {
  [key: string]: StoryAction<T>;
};
