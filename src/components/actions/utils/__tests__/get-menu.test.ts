import { getMenu } from '../get-menu';
import { Definition } from 'ts-to-json';
const definition = {
  click: {
    kind: 'function',
    type: 'Promise',
  },
  mouse: {
    additionalProperties: false,
    properties: {
      click: {
        description: 'Shortcut for `mouse.move`, `mouse.down` and `mouse.up`.',
        kind: 'function',

        required: ['x', 'y'],
        type: 'Promise',
      },
      dblclick: {
        kind: 'function',
        required: ['x', 'y'],
        type: 'Promise',
      },
    },
    required: ['click', 'dblclick'],
    type: 'object',
  },
} as Definition;

describe('getMenu', () => {
  it('should return valid', () => {
    expect(getMenu(definition)).toMatchSnapshot();
  });
});
