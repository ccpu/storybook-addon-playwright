import { Page } from 'playwright-core';

export type StoryActionPosition = { x: number; y: number };

type Modifier = 'Alt' | 'Control' | 'Meta' | 'Shift';

interface StoryActionOption {
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
}

export interface StoryAction<T extends unknown = Page> {
  selector?: string;
  labe?: string;
  options?: (keyof StoryActionOption)[];
  run: (
    page: T,
    selector: string,
    options?: StoryActionOption,
  ) => Promise<void>;
}

export type StoryActions<T extends unknown = Page> = {
  [key: string]: StoryAction<T>;
};
