import { Page } from 'playwright-core';
import { ActionSchemaList } from './action-schema';
import { BrowserTypes, DeviceDescriptor } from './screenshot';

export interface Config<T extends unknown = Page> {
  storybookEndpoint: string;
  customActionSchema?: ActionSchemaList;
  getPage: (
    browserType: BrowserTypes,
    deviceDescriptor: DeviceDescriptor,
  ) => Promise<T>;
  beforeScreenshot?: (page: T, browserType: BrowserTypes) => void;
  afterScreenshot?: (page: T, browserType: BrowserTypes) => void;
  diffDirection?: 'horizontal' | 'vertical';
}
