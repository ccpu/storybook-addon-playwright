import React, { SFC, memo } from 'react';
import { ActionSchemaProp } from './ActionSchemaProp';
import { Definition } from 'ts-to-json';

export interface ActionSchemaPropsProps {
  props: Definition;
  parents?: string[];
  actionId: string;
}

const ActionSchemaProps: SFC<ActionSchemaPropsProps> = memo(
  ({ props, parents = [], actionId }) => {
    return (
      <>
        {Object.keys(props).map((name, i, array) => {
          const param = props[name];
          return (
            <ActionSchemaProp
              key={name}
              name={name}
              schema={param}
              parents={parents}
              actionId={actionId}
              nextPropName={array[i + 1]}
            />
          );
        })}
      </>
    );
  },
);

ActionSchemaProps.displayName = 'ActionSchemaProps';

export { ActionSchemaProps };
