import type { Definition } from 'ts-to-json';
import type { ActionSchema } from '../../../../typings';
import React, { useCallback } from 'react';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { MemoizedSchemaRenderer } from '../../../schema/components/index';
import { useEditorAction } from '../../hooks/use-editor-action';
import { setActionOptions, toggleSubtitleItem } from '../../store/actions';
import { getActionOptionValue } from './utils/index';

export interface ActionSchemaRendererProps {
  schema: ActionSchema;
  actionId: string;
  actionSetId: string;
}

const ActionSchemaRenderer: React.FC<ActionSchemaRendererProps> = (props) => {
  const { schema, actionId, actionSetId } = props;

  const story = useCurrentStoryData();
  const storyId = story?.id;

  const action = useEditorAction(storyId || '', actionId);

  const handleChange = useCallback(
    (objPath, val) => {
      if (!storyId) return;

      setActionOptions({
        actionId,
        actionSetId,
        objPath,
        storyId,
        val,
      });
    },
    [actionId, actionSetId, storyId],
  );

  const handleGetValue = useCallback(
    (optionObjectPath: string, schema: ActionSchema) => {
      if (!action) return undefined;
      const val = getActionOptionValue(action, optionObjectPath, schema);
      return val;
    },
    [action],
  );

  const shouldAppendToTitle = useCallback(
    (optionObjectPath: string) => {
      if (!action || !action.subtitleItems) {
        return undefined;
      }

      return action.subtitleItems.includes(optionObjectPath);
    },
    [action],
  );

  const handleOnAppendValueToTitle = useCallback(
    (optionObjectPath) => {
      if (!storyId) return;

      toggleSubtitleItem({
        actionId,
        actionOptionPath: optionObjectPath,
        actionSetId,
        storyId,
      });
    },
    [actionId, actionSetId, storyId],
  );

  const handleSelectorChange = useCallback(
    (objPath: string, val: unknown) => {
      if (!storyId) return;

      setActionOptions({
        actionId,
        actionSetId,
        objPath,
        storyId,
        val,
      });
    },
    [actionId, actionSetId, storyId],
  );

  if (!action) return null;

  return (
    <div>
      <MemoizedSchemaRenderer
        schemaProps={schema.parameters as Definition}
        required={schema.required}
        onChange={handleChange}
        getValue={handleGetValue}
        shouldAppendToTitle={shouldAppendToTitle as (optionObjectPath: string) => boolean}
        onAppendValueToTitle={handleOnAppendValueToTitle}
        onSelectorChange={handleSelectorChange}
      />
    </div>
  );
};

ActionSchemaRenderer.displayName = 'ActionSchemaRenderer';

export { ActionSchemaRenderer };
