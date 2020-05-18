import {
  isValidAction,
  validAction,
  validateActionList,
} from '../valid-action';
import { getActionSchemaData } from '../../../__test_data__';
import { StoryAction } from '../../typings';

describe('Name of the group', () => {
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

    expect(validAction(getActionSchemaData(), action)).toStrictEqual({
      required: undefined,
    });
  });

  it('should not be valid if selector is not provided', () => {
    const action: StoryAction = {
      args: {},
      id: 'someId',
      name: 'click',
    };

    expect(validAction(getActionSchemaData(), action)).toStrictEqual({
      required: ['selector'],
    });
  });

  it('should not be valid if arg not provided', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
    };

    expect(validAction(getActionSchemaData(), action)).toStrictEqual({
      required: ['selector'],
    });
  });

  it('should not be valid is selector is undefined', () => {
    const action: StoryAction = {
      args: {
        selector: undefined,
      },
      id: 'someId',
      name: 'click',
    };

    expect(validAction(getActionSchemaData(), action)).toStrictEqual({
      required: ['selector'],
    });
  });

  it('should validate if schema required no property', () => {
    const action: StoryAction = {
      args: {},
      id: 'someId',
      name: 'noneRequiredProp',
    };

    expect(validAction(getActionSchemaData(), action)).toStrictEqual({});
  });
});

describe('validateActionList', () => {
  it('should validate all', () => {
    const actions: StoryAction[] = [
      {
        args: {
          options: {
            x: 1,
          },
          selector: 'div>div',
        },
        id: 'someId_1',
        name: 'click',
      },
      {
        id: 'someId_2',
        name: 'click',
      },
    ];
    expect(validateActionList(getActionSchemaData(), actions)).toStrictEqual([
      { id: 'someId_2', name: 'click', required: ['selector'] },
    ]);
  });
});

describe('isValidAction', () => {
  it('should be valid', () => {
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

    expect(isValidAction(getActionSchemaData(), action)).toBeTruthy();
  });

  it('should be invalid', () => {
    const action: StoryAction = {
      id: 'someId',
      name: 'click',
    };

    expect(isValidAction(getActionSchemaData(), action)).toBeFalsy();
  });
});
