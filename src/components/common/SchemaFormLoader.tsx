import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles, Divider, Button } from '@material-ui/core';
import { MemoizedSchemaRenderer } from '../../features/schema/components/index';
import { Config } from 'ts-to-json/dist/src/Config';
import { useAsyncApiCall } from '../../hooks';
import { Loader } from './Loader';
import { Definition } from 'ts-to-json';
import * as immutableObject from 'object-path-immutable';
import { getSchema } from '../../features/schema/schema.client';

const useStyles = makeStyles(
  () => {
    return {
      footer: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 2,
      },
      main: {
        fontSize: 14,
        height: 400,
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: 5,
        paddingRight: 20,
      },
    };
  },
  { name: 'SchemaFormLoader' },
);

export interface SchemaFormProps extends Partial<Config> {
  schemaName: string;
  defaultData?: unknown;
  onSave: (data: unknown) => void;
  active?: boolean;
  FooterComponent?: React.ReactNode;
}

const SchemaFormLoader: React.FC<SchemaFormProps> = ({
  defaultData,
  onSave,
  FooterComponent,
  schemaName,
}) => {
  const classes = useStyles();

  const [tempOptions, setTempOptions] = useState(defaultData);

  const [reset, setReset] = useState(false);

  const { makeCall, result: schema, inProgress } = useAsyncApiCall(getSchema);

  useEffect(() => {
    if (schema || inProgress) return;
    makeCall({ schemaName });
  }, [inProgress, makeCall, schema, schemaName]);

  const handleSave = useCallback(() => {
    onSave(tempOptions);
  }, [onSave, tempOptions]);

  const handleClear = useCallback(() => {
    onSave({});
    setTempOptions({});
    setReset(true);
  }, [onSave]);

  const handleChange = useCallback(
    (path, val) => {
      const options = immutableObject.set(tempOptions, path, val);
      setTempOptions(options);
    },
    [tempOptions],
  );

  const getValue = (path) => {
    const val = immutableObject.get(tempOptions, path);
    return val;
  };

  useEffect(() => {
    if (reset) setReset(false);
  }, [reset]);

  return (
    <>
      <div className={classes.main}>
        <Loader open={schema === undefined} position="relative" />
        {schema && !reset && (
          <MemoizedSchemaRenderer
            schemaProps={schema as unknown as Definition}
            onChange={handleChange}
            getValue={getValue}
          />
        )}
      </div>
      <Divider />
      <div className={classes.footer}>
        <div>{FooterComponent}</div>
        <div>
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </>
  );
};

SchemaFormLoader.displayName = 'SchemaFormLoader';

const MemoizedSchemaFormLoader = React.memo(SchemaFormLoader);
export { SchemaFormLoader, MemoizedSchemaFormLoader };
