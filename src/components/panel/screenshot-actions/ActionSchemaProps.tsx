import React, { SFC, useCallback } from 'react';
import { ActionSchemaProp } from './ActionSchemaProp';
import { Definition } from 'ts-to-json';

export interface ActionSchemaPropsProps {
  props: Definition;
  onChange: (path: string, value: unknown, parents?: string[]) => void;
  parents?: string[];
}

const ActionSchemaProps: SFC<ActionSchemaPropsProps> = ({
  props,
  onChange,
  parents = [],
}) => {
  const handleChange = useCallback(
    (key: string, val: unknown, rootParents = []) => {
      const objPath = [...rootParents, key].join('.');
      onChange(objPath, val);
    },
    [onChange],
  );

  return (
    <>
      {Object.keys(props).map((name) => {
        const param = props[name];
        return (
          <ActionSchemaProp
            key={name}
            name={name}
            schema={param}
            onChange={handleChange}
            parents={parents}
          />
        );
      })}
    </>
  );
};

ActionSchemaProps.displayName = 'ActionSchemaProps';

export { ActionSchemaProps };
