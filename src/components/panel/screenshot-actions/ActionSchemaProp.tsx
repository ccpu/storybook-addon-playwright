import React, { SFC, useCallback, memo } from 'react';

import { Control } from './Control';
import { ActionSchemaProps } from './ActionSchemaProps';
import { useActionDispatchContext } from '../../../store';
import { getActionOptionValue } from './utils';
import { SelectorControl } from './SelectorControl';
import { useEditorAction } from '../../../hooks';
import { ActionSchema } from '../../../typings';

export interface ActionSchemaPropProps {
  name: string;
  parents?: string[];
  schema: ActionSchema;
  actionId: string;
  nextPropName: string;
  isRequired?: boolean;
}

const ActionSchemaProp: SFC<ActionSchemaPropProps> = memo(
  ({ name, schema, parents = [], actionId, nextPropName, isRequired }) => {
    const dispatch = useActionDispatchContext();
    const optionObjectPath = [...parents, name].join('.');

    const handleChange = useCallback(
      (val) => {
        dispatch({
          actionId,
          objPath: optionObjectPath,
          type: 'setActionOptions',
          val,
        });
      },
      [actionId, dispatch, optionObjectPath],
    );

    const handleAppendToTile = useCallback(() => {
      dispatch({
        actionId,
        actionOptionPath: optionObjectPath,
        type: 'toggleSubtitleItem',
      });
    }, [actionId, dispatch, optionObjectPath]);

    const action = useEditorAction(actionId);

    if (!action) return null;

    const value = getActionOptionValue(action, optionObjectPath);
    const appendToTile =
      action.subtitleItems && action.subtitleItems.includes(optionObjectPath);

    if (name === 'selector' || name === 'x' || name === 'y') {
      return (
        <SelectorControl
          label={name}
          type={name === 'selector' ? 'text' : 'number'}
          onChange={handleChange}
          selectorType={name === 'selector' ? 'selector' : 'position'}
          value={value}
          description={schema.description}
          onAppendValueToTitle={handleAppendToTile}
          appendValueToTitle={appendToTile}
          isFollowedByPositionProp={
            nextPropName === 'x' || nextPropName === 'y'
          }
          fullObjectPath={optionObjectPath}
          actionId={actionId}
          isRequired={isRequired}
        />
      );
    }

    if (schema.enum) {
      return (
        <Control
          label={name}
          type="select"
          onChange={handleChange}
          options={schema.enum as string[]}
          value={value}
          description={schema.description}
          onAppendValueToTitle={handleAppendToTile}
          appendValueToTitle={appendToTile}
          isRequired={isRequired}
        />
      );
    }

    switch (schema.type) {
      case 'string':
        return (
          <Control
            label={name}
            type="text"
            onChange={handleChange}
            value={value}
            description={schema.description}
            onAppendValueToTitle={handleAppendToTile}
            appendValueToTitle={appendToTile}
            isRequired={isRequired}
          />
        );
      case 'number':
      case 'integer':
        return (
          <Control
            label={name}
            type="number"
            onChange={handleChange}
            value={value}
            description={schema.description}
            onAppendValueToTitle={handleAppendToTile}
            appendValueToTitle={appendToTile}
            isRequired={isRequired}
          />
        );
      case 'boolean':
        return (
          <Control
            label={name}
            type="boolean"
            onChange={handleChange}
            value={value}
            description={schema.description}
            onAppendValueToTitle={handleAppendToTile}
            appendValueToTitle={appendToTile}
            isRequired={isRequired}
          />
        );
      case 'array': {
        if (!schema.items) return null;
        const items = (schema.items as ActionSchema).enum;
        if (!items) return null;
        return (
          <Control
            label={name}
            type="options"
            onChange={handleChange}
            display="inline-check"
            options={items as string[]}
            value={value}
            description={schema.description}
            onAppendValueToTitle={handleAppendToTile}
            appendValueToTitle={appendToTile}
            isRequired={isRequired}
          />
        );
      }
      case 'object':
        return (
          <ActionSchemaProps
            schemaProps={schema.properties}
            parents={[...parents, name]}
            actionId={actionId}
            required={schema.required}
          />
        );
      default:
        return null;
    }
  },
);

ActionSchemaProp.displayName = 'ActionSchemaProp';

export { ActionSchemaProp };
