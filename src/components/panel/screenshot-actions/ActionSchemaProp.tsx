import React, { SFC, useCallback, memo, useContext, useMemo } from 'react';
import { Definition } from 'ts-to-json';
import { Control } from './Control';
import { ActionSchemaProps } from './ActionSchemaProps';
import { ActionContext, ActionDispatchContext } from '../../../store';
import { getActionOptionValue } from './utils';
import { SelectorControl } from './SelectorControl';

export interface ActionSchemaPropProps {
  name: string;
  parents?: string[];
  schema: Definition;
  actionName: string;
  actionId: string;
}

const ActionSchemaProp: SFC<ActionSchemaPropProps> = memo(
  ({ name, schema, parents = [], actionName, actionId }) => {
    const dispatch = useContext(ActionDispatchContext);
    const state = useContext(ActionContext);
    const optionObjectPath = [...parents, name].join('.');

    const handleChange = useCallback(
      (val) => {
        const fullPath = `${actionName}.${optionObjectPath}`;
        dispatch({
          actionId,
          objPath: fullPath,
          type: 'setActionOptions',
          val,
        });
      },
      [actionId, actionName, dispatch, optionObjectPath],
    );

    const handleAppendToTile = useCallback(() => {
      dispatch({
        actionId,
        actionOptionPath: optionObjectPath,
        type: 'toggleSubtitleItem',
      });
    }, [actionId, dispatch, optionObjectPath]);

    const action = state.storyActions.find((x) => x.id === actionId);
    const value = getActionOptionValue(action, actionName, optionObjectPath);
    const appendToTile =
      action.subtitleItems && action.subtitleItems.includes(optionObjectPath);

    return useMemo(() => {
      if (name === 'selector') {
        return (
          <SelectorControl
            label={name}
            type="text"
            onChange={handleChange}
            value={value}
            description={schema.description}
            onAppendValueToTitle={handleAppendToTile}
            appendValueToTitle={appendToTile}
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
            />
          );
        case 'array': {
          if (!schema.items) return null;
          const items = (schema.items as Definition).enum;
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
            />
          );
        }
        case 'object':
          return (
            <ActionSchemaProps
              props={schema.properties}
              parents={[...parents, name]}
              actionName={actionName}
              actionId={actionId}
            />
          );
        default:
          return null;
      }
    }, [
      actionId,
      actionName,
      appendToTile,
      handleAppendToTile,
      handleChange,
      name,
      parents,
      schema.description,
      schema.enum,
      schema.items,
      schema.properties,
      schema.type,
      value,
    ]);
  },
);

ActionSchemaProp.displayName = 'ActionSchemaProp';

export { ActionSchemaProp };
