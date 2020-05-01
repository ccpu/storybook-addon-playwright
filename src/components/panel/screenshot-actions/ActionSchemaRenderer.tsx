import React, { SFC, useCallback } from 'react';
import { ActionSchema, StoryAction } from '../../../typings';
import { Definition } from 'ts-to-json';
import { ActionSchemaProps } from './ActionSchemaProps';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  storyAction: StoryAction;
}

const ActionSchemaRenderer: SFC<ActionSchemaRendererProps> = (props) => {
  const { schema } = props;
  // console.log(Object.keys(schema.parameters).join(','));

  const handleChange = useCallback((val) => {
    console.log(val);
  }, []);

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
