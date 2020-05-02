import React, { SFC } from 'react';
import { ActionSchema } from '../../../typings';
import { Definition } from 'ts-to-json';
import { ActionSchemaProps } from './ActionSchemaProps';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  actionId: string;
  path: string;
}

const ActionSchemaRenderer: SFC<ActionSchemaRendererProps> = (props) => {
  const { schema, path, actionId } = props;

  return (
    <div>
      <ActionSchemaProps
        props={schema.parameters as Definition}
        actionName={path}
        actionId={actionId}
      />
    </div>
  );
};

ActionSchemaRenderer.displayName = 'ActionSchemaRenderer';

export { ActionSchemaRenderer };
