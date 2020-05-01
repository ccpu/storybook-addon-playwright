import React, { SFC } from 'react';
import { ActionSchemaProp } from './ActionSchemaProp';
import { Definition } from 'ts-to-json';

export interface ActionSchemaPropsProps {
  props: Definition;
  onChange: (key: string, value: unknown) => void;
}

const ActionSchemaProps: SFC<ActionSchemaPropsProps> = (properties) => {
  const { props, onChange } = properties;

  return (
    <>
      {Object.keys(props).map((name) => {
        const param = props[name];
        return (
          <ActionSchemaProp
            key={name}
            name={name}
            schema={param}
            onChange={onChange}
          />
        );
      })}
    </>
  );
};

ActionSchemaProps.displayName = 'ActionSchemaProps';

export { ActionSchemaProps };
