import { Page } from 'playwright-core';
import { CustomActionListSchema } from './action-schema';
import { BrowserTypes } from './screenshot-info';

export interface Config<T extends unknown = Page> {
  storybookEndpoint?: string;
  customActionSchema?: CustomActionListSchema;
  getPage: (browserType: BrowserTypes) => Promise<T>;
  beforeSnapshot?: (page: T, browserType: BrowserTypes) => void;
  afterSnapshot?: (page: T, browserType: BrowserTypes) => void;
}
