import { Page } from 'playwright';
import { ClearInputOptions } from './typings';

export async function clearInput(
  this: Page,
  selector: string,
  options: ClearInputOptions = {},
) {
  const { blur, timeout } = options;

  await this.fill(selector, '');

  if (blur) {
    await this.$eval(selector, (e) => e.blur());
  }

  if (timeout) {
    await this.waitForTimeout(options.timeout);
  }
}
