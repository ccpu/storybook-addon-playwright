import React, { SFC, useCallback } from 'react';
import { ActionSchema } from '../../../typings';
import { Definition } from 'ts-to-json';
import { ActionSchemaProps } from './ActionSchemaProps';
// import { set } from 'object-path-immutable';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  // actionData: unknown;
  actionId: string;
  path: string;
  onChange: (objPath: string, value: unknown) => void;
}

const ActionSchemaRenderer: SFC<ActionSchemaRendererProps> = (props) => {
  const { schema, path, onChange, actionId } = props;

  const handleChange = useCallback(
    (objPath: string, val: unknown) => {
      onChange(`${path}.${objPath}`, val);
    },
    [onChange, path],
  );

  // console.log(path, actionData);

  return (
    <div>
      <ActionSchemaProps
        props={schema.parameters as Definition}
        onChange={handleChange}
        // actionData={actionData}
        actionName={path}
        actionId={actionId}
      />
    </div>
  );
};

ActionSchemaRenderer.displayName = 'ActionSchemaRenderer';

export { ActionSchemaRenderer };
