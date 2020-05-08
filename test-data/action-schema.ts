/* eslint-disable sort-keys-fix/sort-keys-fix */

import { ActionSchemaList } from '../src/typings';

export const actionSchema: ActionSchemaList = {
  click: {
    kind: 'function',
    type: 'Promise' as never,
    parameters: {
      selector: {
        type: 'string',
      },
      options: {
        type: 'object',
        properties: {
          button: {
            type: 'string',
            enum: ['left', 'right', 'middle'],
            description: 'Defaults to `left`.',
          },
          clickCount: {
            type: 'number',
            description: 'defaults to 1. See UIEvent.detail.',
          },
          delay: {
            type: 'number',
            description:
              'Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.',
          },
          position: {
            type: 'object',
            properties: {
              x: {
                type: 'number',
              },
              y: {
                type: 'number',
              },
            },
            required: ['x', 'y'],
            additionalProperties: false,
            description:
              'A point to click relative to the top-left corner of element padding box. If not specified, clicks to some visible point of the element.',
          },

          timeout: {
            type: 'number',
            description:
              'Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by using the browserContext.setDefaultTimeout(timeout) or page.setDefaultTimeout(timeout) methods.',
          },
        },
        additionalProperties: false,
      },
      delay: {
        type: 'number',
      },
    },
    required: ['selector'],
  },
  mouse: {
    type: 'object',
    properties: {
      click: {
        kind: 'function',
        type: 'Promise' as never,
        parameters: {
          x: {
            type: 'number',
          },
          y: {
            type: 'number',
          },
          options: {
            type: 'object',
            properties: {
              button: {
                type: 'string',
                enum: ['left', 'right', 'middle'],
                description: 'Defaults to `left`.',
              },
              clickCount: {
                type: 'number',
                description: 'defaults to 1. See UIEvent.detail.',
              },
              delay: {
                type: 'number',
                description:
                  'Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.',
              },
            },
            additionalProperties: false,
          },
        },
        required: ['x', 'y'],
        description: 'Shortcut for `mouse.move`, `mouse.down` and `mouse.up`.',
      },
    },
  },
};
