/* eslint-disable sort-keys-fix/sort-keys-fix */

import { getActionArgs } from '../get-action-args';
import { actionSchema } from '../../../test-data/action-schema';
import { StoryAction } from '../../typings';

describe('getActionArgs', () => {
  it('should generate args in current order', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
      args: {
        options: {},
        selector: 'div>div',
      },
    };
    const sortedAction = getActionArgs(action, actionSchema);
    expect(sortedAction).toStrictEqual(['div>div', {}]);
  });

  it('should generate nested action args in current order', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'mouse.click',
      args: {
        options: {},
        x: 1,
        y: 2,
      },
    };
    const sortedAction = getActionArgs(action, actionSchema);
    expect(sortedAction).toStrictEqual([1, 2, {}]);
  });

  it('should keep order even if no value present', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
      args: {
        options: {},
      },
    };
    const sortedAction = getActionArgs(action, actionSchema);
    expect(sortedAction).toStrictEqual([[undefined], {}]);
  });

  it('should throw error if action is not exist in schema, so we know its deprecated', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'mouse.deprecated',
      args: {
        y: 2,
        x: 1,
      },
    };

    expect(() => {
      getActionArgs(action, actionSchema);
    }).toThrowError(
      `Unable to find 'mouse.deprecated', possibly this action has deprecated/removed from playwright.`,
    );
  });
});
