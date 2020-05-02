import React, { SFC, useCallback } from 'react';
import { ActionSchema, StoryAction } from '../../../typings';
import { Definition } from 'ts-to-json';
import { ActionSchemaProps } from './ActionSchemaProps';
// import { set } from 'object-path-immutable';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  storyAction: StoryAction;
  path: string;
  onChange: (objPath: string, value: unknown) => void;
}

const ActionSchemaRenderer: SFC<ActionSchemaRendererProps> = (props) => {
  const { schema, path, onChange, storyAction } = props;

  const handleChange = useCallback(
    (objPath: string, val: unknown) => {
      onChange(`${path}.${objPath}`, val);
    },
    [onChange, path],
  );

  console.log(path, storyAction, schema);

  return (
    <div>
      <ActionSchemaProps
        props={schema.parameters as Definition}
        onChange={handleChange}
      />
    </div>
  );
};

ActionSchemaRenderer.displayName = 'ActionSchemaRenderer';

export { ActionSchemaRenderer };
