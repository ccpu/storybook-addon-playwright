import { executeAction } from '../execute-action';
import { Page } from 'playwright-core';
import { StoryAction } from '../../../../typings';
import { actionSchema } from '../../../../../test-data';

jest.mock('../../services/get-actions-schema', () => ({
  getActionsSchema: () => {
    return actionSchema;
  },
}));

const page = {
  click: async () => {
    await new Promise((resolve) => resolve('pass'));
  },
};

describe('executeAction', () => {
  it('should execute', async () => {
    // const spyOnPage = jest.spyOn(page, 'click');

    const action: StoryAction = {
      args: {
        options: {},
        selector: 'div>div',
      },
      id: 'someId',
      name: 'click',
    };

    const val = await executeAction((page as unknown) as Page, action);

    expect(val).toBe('pass');
  });
});
