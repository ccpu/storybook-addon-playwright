/* eslint-disable sort-keys-fix/sort-keys-fix */

import { sortActionArgs, sortActionListArgs } from '../sort-action-args';
import { actionSchema } from '../../../test-data';
import { StoryAction } from '../../typings';
import mockConsole from 'jest-mock-console';

describe('sortActionParameter', () => {
  it('should sort action parameter', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
      args: {
        options: {},
        selector: 'selector',
      },
    };
    const sortedAction = sortActionArgs(action, actionSchema);
    expect(JSON.stringify(sortedAction)).toBe(
      '{"id":"someId","name":"click","args":{"selector":"selector","options":{}}}',
    );
  });

  it('should sort nested action parameter', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'mouse.click',
      args: {
        options: {},
        x: 1,
        y: 2,
      },
    };
    const sortedAction = sortActionArgs(action, actionSchema);
    expect(JSON.stringify(sortedAction)).toBe(
      `{"id":"someId","name":"mouse.click","args":{"x":1,"y":2,"options":{}}}`,
    );
  });

  it('should keep order even if no value present', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
      args: {
        options: {},
      },
    };
    const sortedAction = sortActionArgs(action, actionSchema);
    expect(JSON.stringify(sortedAction)).toBe(
      `{"id":"someId","name":"click","args":{"selector":null,"options":{}}}`,
    );
  });

  it('should show error if action is not exist in schema, so we know its deprecated', () => {
    const restoreConsole = mockConsole();
    const action: StoryAction = {
      id: 'someId',
      name: 'mouse.deprecated',
      args: {
        y: 2,
        x: 1,
      },
    };
    const sortedAction = sortActionArgs(action, actionSchema);
    expect(console.error).toHaveBeenCalledWith(
      `Unable to find 'mouse.deprecated', possibly this action has deprecated/removed from playwright.`,
    );

    // should return original
    expect(JSON.stringify(sortedAction)).toBe(
      `{"id":"someId","name":"mouse.deprecated","args":{"y":2,"x":1}}`,
    );
    restoreConsole();
  });
});

describe('sortActionListParameter ', () => {
  it('should handle multi actions', () => {
    const actions: StoryAction[] = [
      {
        id: 'someId',
        name: 'click',
        args: {
          options: {},
          selector: 'selector',
        },
      },
      {
        id: 'someId',
        name: 'mouse.click',
        args: {
          options: {},
          x: 1,
          y: 2,
        },
      },
    ];
    const sortedAction = sortActionListArgs(actionSchema, actions);
    expect(JSON.stringify(sortedAction)).toBe(
      `[{"id":"someId","name":"click","args":{"selector":"selector","options":{}}},{"id":"someId","name":"mouse.click","args":{"x":1,"y":2,"options":{}}}]`,
    );
  });
});
