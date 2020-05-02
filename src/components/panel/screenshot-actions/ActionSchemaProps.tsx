import React, { SFC, useCallback } from 'react';
import { ActionSchemaProp } from './ActionSchemaProp';
import { Definition } from 'ts-to-json';

export interface ActionSchemaPropsProps {
  props: Definition;
  onChange: (path: string, value: unknown, parents?: string[]) => void;
  parents?: string[];
  actionName: string;
  actionId: string;
}

const ActionSchemaProps: SFC<ActionSchemaPropsProps> = ({
  props,
  onChange,
  parents = [],
  actionName,
  actionId,
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
            actionName={actionName}
            actionId={actionId}
          />
        );
      })}
    </>
  );
};

ActionSchemaProps.displayName = 'ActionSchemaProps';

export { ActionSchemaProps };
