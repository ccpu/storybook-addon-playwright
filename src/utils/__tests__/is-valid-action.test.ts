import { isValidAction } from '../is-valid-action';
import { actionSchema } from '../../../test-data';
import { StoryAction } from '../../typings';

describe('isValidAction', () => {
  it('should have valid selector', () => {
    const action: StoryAction = {
      args: {
        options: {
          x: 1,
        },
        selector: 'div>div',
      },
      id: 'someId',
      name: 'click',
    };

    expect(isValidAction(actionSchema, action)).toBeTruthy();
  });

  it('should not be valid if selector is not provided', () => {
    const action: StoryAction = {
      args: {},
      id: 'someId',
      name: 'click',
    };

    expect(isValidAction(actionSchema, action)).toBeFalsy();
  });

  it('should not be valid if arg not provided', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
    };

    expect(isValidAction(actionSchema, action)).toBeFalsy();
  });

  it('should not be valid is selector is undefined', () => {
    const action: StoryAction = {
      args: {
        selector: undefined,
      },
      id: 'someId',
      name: 'click',
    };

    expect(isValidAction(actionSchema, action)).toBeFalsy();
  });

  it('should validate if schema required no property', () => {
    const action: StoryAction = {
      args: {},
      id: 'someId',
      name: 'noneRequiredProp',
    };

    expect(isValidAction(actionSchema, action)).toBeTruthy();
  });
});
