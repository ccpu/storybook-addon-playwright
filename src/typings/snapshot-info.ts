import { Page } from 'playwright-core';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface PageInfo<T extends unknown = Page> {
  page: T;
  browserName: BrowserTypes;
}

type PartialPage = Partial<Page>;

type PromisePage<T> = Promise<PageInfo<T> | PageInfo<T>[]>;

interface Action {
  name: string;
  labe?: string;
  execute: () => void;
}

export interface SetupSnapshot<T extends PartialPage> {
  storybookEndpoint?: string;
  browserTypes?: BrowserTypes[];
  getPage: (browserTypes?: BrowserTypes[]) => PromisePage<T>;
  beforeSnapshot?: (page: T) => PromisePage<T>;
  afterSnapshot?: (page: T) => PromisePage<T>;
  actions?: Action;
}

export interface SnapshotInfo {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}
