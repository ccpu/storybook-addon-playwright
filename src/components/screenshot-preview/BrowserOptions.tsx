import React, { SFC, useCallback } from 'react';
import { ActionProvider } from '../../store/actions';
import { MemoizedSchemaRenderer } from '../schema';
import { Definition } from 'ts-to-json';
import * as immutableObject from 'object-path-immutable';
import { useBrowserDevice } from '../../hooks/';
import { BrowserOptions } from '../../typings';

const options = {
  deviceScaleFactor: {
    type: 'number',
  },
  hasTouch: {
    type: 'boolean',
  },
  isMobile: {
    type: 'boolean',
  },
  javaScriptEnabled: {
    type: 'boolean',
  },
  userAgent: {
    type: 'string',
  },
  viewPort: {
    properties: {
      height: {
        type: 'number',
      },
      width: {
        type: 'number',
      },
    },
    required: ['width', 'height'],
    type: 'object',
  },
};

// export interface BrowserOptionsProps {
//   schema: ActionSchema;
// }

const BrowserOptions: SFC = () => {
  const { setOptions, browserDevice } = useBrowserDevice();

  const handleChange = useCallback(
    (path, val) => {
      // const options = immutableObject.set(browserDevice['all'], path, val);
      // setOptions('all', options as BrowserOptions);
      // console.log(immutableObject.set({}, path, val));
      // console.log(path, val);
    },
    [browserDevice, setOptions],
  );

  const getValue = useCallback(() => {
    console.log();
  }, []);

  return (
    <ActionProvider>
      <MemoizedSchemaRenderer
        schemaProps={options as Definition}
        onChange={handleChange}
        getValue={getValue}
      />
    </ActionProvider>
  );
};

BrowserOptions.displayName = 'BrowserOptions';

export { BrowserOptions };
