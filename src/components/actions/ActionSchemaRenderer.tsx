import React, { SFC, useCallback } from 'react';
import { ActionSchema } from '../../typings';
import { Definition } from 'ts-to-json';
import { MemoizedSchemaRenderer } from '../schema';
import { useActionDispatchContext } from '../../store';
import { useCurrentStoryData, useEditorAction } from '../../hooks';
import { getActionOptionValue } from './utils';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  actionId: string;
  actionSetId: string;
}

const ActionSchemaRenderer: SFC<ActionSchemaRendererProps> = (props) => {
  const { schema, actionId, actionSetId } = props;

  const dispatch = useActionDispatchContext();

  const story = useCurrentStoryData();

  const action = useEditorAction(story.id, actionId);

  const handleChange = useCallback(
    (objPath, val) => {
      dispatch({
        actionId,
        actionSetId,
        objPath,
        storyId: story.id,
        type: 'setActionOptions',
        val,
      });
    },
    [actionId, actionSetId, dispatch, story.id],
  );

  const handleGetValue = useCallback(
    (optionObjectPath: string, schema: ActionSchema) => {
      console.log(optionObjectPath, schema);
      return getActionOptionValue(action, optionObjectPath, schema);
    },
    [action],
  );

  const shouldAppendToTitle = useCallback(
    (optionObjectPath: string) => {
      return (
        action &&
        action.subtitleItems &&
        action.subtitleItems.includes(optionObjectPath)
      );
    },
    [action],
  );

  const handleOnAppendValueToTitle = useCallback(
    (optionObjectPath) => {
      dispatch({
        actionId,
        actionOptionPath: optionObjectPath,
        actionSetId,
        storyId: story.id,
        type: 'toggleSubtitleItem',
      });
    },
    [actionId, actionSetId, dispatch, story.id],
  );

  const handleSelectorChange = useCallback(
    (objPath: string, val: unknown) => {
      dispatch({
        actionId,
        actionSetId,
        objPath: objPath,
        storyId: story.id,
        type: 'setActionOptions',
        val,
      });
    },
    [actionId, actionSetId, dispatch, story.id],
  );

  return (
    <div>
      <MemoizedSchemaRenderer
        schemaProps={schema.parameters as Definition}
        required={schema.required}
        onChange={handleChange}
        getValue={handleGetValue}
        shouldAppendToTitle={shouldAppendToTitle}
        onAppendValueToTitle={handleOnAppendValueToTitle}
        onSelectorChange={handleSelectorChange}
      />
    </div>
  );
};

ActionSchemaRenderer.displayName = 'ActionSchemaRenderer';

export { ActionSchemaRenderer };
