import React, { SFC } from 'react';
import { ActionSchema } from '../../../typings';
import { Definition } from 'ts-to-json';
import { ActionSchemaProps } from './ActionSchemaProps';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  actionId: string;
}

const ActionSchemaRenderer: SFC<ActionSchemaRendererProps> = (props) => {
  const { schema, actionId } = props;

  return (
    <div>
      <ActionSchemaProps
        schemaProps={schema.parameters as Definition}
        actionId={actionId}
        required={schema.required}
      />
    </div>
  );
};

ActionSchemaRenderer.displayName = 'ActionSchemaRenderer';

export { ActionSchemaRenderer };
