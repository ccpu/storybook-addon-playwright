import React, { SFC, memo } from 'react';
import { ActionSchemaProp } from './ActionSchemaProp';
import { ActionSchema } from '../../typings';

export interface ActionSchemaPropsProps {
  schemaProps: ActionSchema;
  parents?: string[];
  actionId: string;
  required?: string[];
}

const ActionSchemaProps: SFC<ActionSchemaPropsProps> = memo(
  ({ schemaProps, required, parents = [], actionId }) => {
    return (
      <>
        {Object.keys(schemaProps).map((name, i, array) => {
          const param = schemaProps[name];
          return (
            <ActionSchemaProp
              key={name}
              name={name}
              schema={param}
              parents={parents}
              actionId={actionId}
              nextPropName={array[i + 1]}
              isRequired={required && required.indexOf(name) !== -1}
            />
          );
        })}
      </>
    );
  },
);

ActionSchemaProps.displayName = 'ActionSchemaProps';

export { ActionSchemaProps };
