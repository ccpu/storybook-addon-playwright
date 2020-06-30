/* istanbul ignore file */
import { Page } from 'playwright-core';
import { NewPageFunc } from '@playwright-utils/page/src/typings/page';

export interface PlaywrightPage extends Page, NewPageFunc {}
