import { Page } from 'playwright-core';
import { ActionSchemaList } from './action-schema';
import { BrowserTypes, DeviceDescriptor } from './screenshot';
import { PageMethodKeys } from '../api/server/services/typings';
import { DiffDirection } from '../api/typings';

export interface Config<T extends unknown = Page> {
  storybookEndpoint: string;
  customActionSchema?: ActionSchemaList;
  pageMethods?: PageMethodKeys[];
  getPage: (
    browserType: BrowserTypes,
    deviceDescriptor: DeviceDescriptor,
  ) => Promise<T>;
  beforeScreenshot?: (page: T, browserType: BrowserTypes) => void;
  afterScreenshot?: (page: T, browserType: BrowserTypes) => void;
  diffDirection?: DiffDirection;
}
