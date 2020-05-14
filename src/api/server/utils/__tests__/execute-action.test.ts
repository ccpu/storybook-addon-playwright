import { executeAction } from '../execute-action';
import { Page } from 'playwright-core';
import { StoryAction } from '../../../../typings';
import { getActionSchemaData } from '../../../../../__test_helper__';

jest.mock('../../services/get-actions-schema', () => ({
  getActionsSchema: () => {
    return getActionSchemaData();
  },
}));

const page = {
  click: async (...args) => {
    return await new Promise((resolve) => resolve(args));
  },
  mouse: {
    click: async (...args) => {
      return await new Promise((resolve) => resolve(args));
    },
  },
};

describe('executeAction', () => {
  it('should execute', async () => {
    const action: StoryAction = {
      args: {
        options: {},
        selector: 'div>div',
      },
      id: 'someId',
      name: 'click',
    };

    const val = await executeAction((page as unknown) as Page, action);

    expect(val).toStrictEqual(['div>div']);
  });

  it('should not execute if required param not provided e.g selector', async () => {
    const action: StoryAction = {
      args: {
        options: {},
      },
      id: 'someId',
      name: 'click',
    };

    const val = await executeAction((page as unknown) as Page, action);

    expect(val).toStrictEqual(undefined);
  });

  it('should execute nested', async () => {
    const action: StoryAction = {
      args: {
        x: 1,
        y: 1,
      },
      id: 'someId',
      name: 'mouse.click',
    };

    const val = await executeAction((page as unknown) as Page, action);

    expect(val).toStrictEqual([1, 1]);
  });

  it('should not execute if action is not implemented', async () => {
    const action: StoryAction = {
      args: {
        selector: 'html',
      },
      id: 'someId',
      name: 'customAction',
    };

    const val = await executeAction((page as unknown) as Page, action);

    expect(val).toStrictEqual(undefined);
  });
});
