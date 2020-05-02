import React, { SFC, memo } from 'react';
import { ActionSchemaProp } from './ActionSchemaProp';
import { Definition } from 'ts-to-json';

export interface ActionSchemaPropsProps {
  props: Definition;
  parents?: string[];
  actionName: string;
  actionId: string;
}

const ActionSchemaProps: SFC<ActionSchemaPropsProps> = memo(
  ({ props, parents = [], actionName, actionId }) => {
    return (
      <>
        {Object.keys(props).map((name) => {
          const param = props[name];
          return (
            <ActionSchemaProp
              key={name}
              name={name}
              schema={param}
              parents={parents}
              actionName={actionName}
              actionId={actionId}
            />
          );
        })}
      </>
    );
  },
);

ActionSchemaProps.displayName = 'ActionSchemaProps';

export { ActionSchemaProps };
