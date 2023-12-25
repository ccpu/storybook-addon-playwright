import { Page } from 'playwright';
import { ClearInputAndTypeOptions } from './typings';
import { clearInput } from './clear-input';

export async function clearInputAndType(
  this: Page,
  selector: string,
  text: string,
  options?: ClearInputAndTypeOptions,
) {
  await clearInput.call(this, selector);

  await this.type(selector, text, options);
}
