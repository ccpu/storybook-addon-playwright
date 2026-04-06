/* eslint-disable sort-keys-fix/sort-keys-fix */
import { ActionSchemaList } from '../../src/typings';

export const getActionSchemaData = (): ActionSchemaList => ({
  click: {
    parameters: {
      selector: {
        type: 'string',
      },
      options: {
        additionalProperties: false,
        properties: {
          button: {
            description: 'Defaults to `left`.',
            enum: ['left', 'right', 'middle'],
            type: 'string',
          },
          clickCount: {
            description: 'defaults to 1. See UIEvent.detail.',
            type: 'number',
          },
          delay: {
            description:
              'Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.',
            type: 'number',
          },
          position: {
            additionalProperties: false,
            description:
              'A point to click relative to the top-left corner of element padding box. If not specified, clicks to some visible point of the element.',
            properties: {
              x: {
                type: 'number',
              },
              y: {
                type: 'number',
              },
            },
            required: ['x', 'y'],
            type: 'object',
          },
          timeout: {
            description:
              'Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by using the browserContext.setDefaultTimeout(timeout) or page.setDefaultTimeout(timeout) methods.',
            type: 'number',
          },
        },
        type: 'object',
      },
      delay: {
        type: 'number',
      },
    },
    required: ['selector'],
    type: 'Promise' as never,
  },
  customAction: {
    parameters: {
      selector: {
        type: 'string',
      },
    },
    type: 'null',
  },
  mouse: {
    properties: {
      click: {
        description: 'Shortcut for `mouse.move`, `mouse.down` and `mouse.up`.',
        kind: 'function',
        parameters: {
          x: {
            type: 'number',
          },
          y: {
            type: 'number',
          },
          options: {
            additionalProperties: false,
            properties: {
              button: {
                description: 'Defaults to `left`.',
                enum: ['left', 'right', 'middle'],
                type: 'string',
              },
              clickCount: {
                description: 'defaults to 1. See UIEvent.detail.',
                type: 'number',
              },
              delay: {
                description:
                  'Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.',
                type: 'number',
              },
            },
            type: 'object',
          },
        },
        required: ['x', 'y'],
        type: 'Promise' as never,
      },
    },
    type: 'object',
  },
  noneRequiredProp: {
    parameters: {
      selector: {
        type: 'string',
      },
    },
    type: 'Promise' as never,
  },
});
