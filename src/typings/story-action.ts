import { Page } from 'playwright-core';
import { KnobType } from '@storybook/addon-knobs/dist/components/types';
import { Definition } from 'ts-to-json';
export type StoryActionPosition = { x: number; y: number };

export type ActionSchema = Definition;

type Modifier = 'Alt' | 'Control' | 'Meta' | 'Shift';

export type ControlTypes = KnobType;

export interface ActionControlPredefinedOptions {
  position?: StoryActionPosition;
  delay?: number;
  modifiers?: Modifier[];
  force?: boolean;
  timeout?: 0;
  button?: 'left' | 'right' | 'middle';
  clickCount?: number;
  steps?: number;
  value?: string;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  noWaitAfter?: boolean;
  selector?: string;
}

interface StoryActionCustomOptions {
  controlType: ControlTypes;
  label?: string;
}

export type ActionControlPredefinedOptionKeys = keyof ActionControlPredefinedOptions;

export interface StoryAction<T extends unknown = Page> {
  id?: string;
  schemaKey: string;

  labe?: string;
  name?: string;
  requiredSelector?: boolean;
  actions?: unknown;
  // controlType: ControlTypes;
  predefinedOptions?: ActionControlPredefinedOptionKeys[];
  customOptions?: StoryActionCustomOptions;
  run?: (
    page: T,
    selector: string,
    options?: ActionControlPredefinedOptions,
  ) => Promise<void>;
}

export type StoryActions<T extends unknown = Page> = {
  [key: string]: StoryAction<T>;
};
