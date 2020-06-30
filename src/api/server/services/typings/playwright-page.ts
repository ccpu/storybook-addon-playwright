/* istanbul ignore file */
import { Page } from 'playwright-core';
import { NewPageFunc } from '@playwright-utils/page/src/typings/page';

export interface PlaywrightPage extends Page, NewPageFunc {}
export type PageMethodKeys = keyof PlaywrightPage;

// export async function addBox(this: Page, position?: { x: number; y: number }) {
//   await this.evaluate(() => {
//     const div = document.createElement('div');
//     div.style.backgroundColor = '#009EEA';
//     div.style.width = '200px';
//     div.style.height = '200px';
//     div.style.position = 'absolute';
//     div.style.top = position.x + 'px';
//     div.style.left = position.y + 'px';
//     document.body.append(div);
//   });
// }
