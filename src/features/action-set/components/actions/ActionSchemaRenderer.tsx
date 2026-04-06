import React, { useCallback } from 'react';
import { ActionSchema } from '../../../../typings';
import { Definition } from 'ts-to-json';
import { MemoizedSchemaRenderer } from '../../../schema/components/index';
import { setActionOptions, toggleSubtitleItem } from '../../../../store';
import { useCurrentStoryData, useEditorAction } from '../../../../hooks';
import { getActionOptionValue } from './utils/index';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  actionId: string;
  actionSetId: string;
}

const ActionSchemaRenderer: React.FC<ActionSchemaRendererProps> = (props) => {
  const { schema, actionId, actionSetId } = props;

  const story = useCurrentStoryData();

  const action = useEditorAction(story && story.id, actionId);

  const handleChange = useCallback(
    (objPath, val) => {
      setActionOptions({
        actionId,
        actionSetId,
        objPath,
        storyId: story.id,
        val,
      });
    },
    [actionId, actionSetId, story],
  );

  const handleGetValue = useCallback(
    (optionObjectPath: string, schema: ActionSchema) => {
      const val = getActionOptionValue(action, optionObjectPath, schema);
      return val;
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
      toggleSubtitleItem({
        actionId,
        actionOptionPath: optionObjectPath,
        actionSetId,
        storyId: story.id,
      });
    },
    [actionId, actionSetId, story],
  );

  const handleSelectorChange = useCallback(
    (objPath: string, val: unknown) => {
      setActionOptions({
        actionId,
        actionSetId,
        objPath,
        storyId: story.id,
        val,
      });
    },
    [actionId, actionSetId, story],
  );

  if (!action) return null;

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
