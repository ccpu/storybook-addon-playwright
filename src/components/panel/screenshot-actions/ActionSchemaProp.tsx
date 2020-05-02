import React, { SFC, useCallback, memo, useContext, useMemo } from 'react';
import { Definition } from 'ts-to-json';
import { ControlForm } from './ControlForm';
import { ActionSchemaProps } from './ActionSchemaProps';
import { ActionContext, ActionDispatchContext } from '../../../store';
import * as immutableObject from 'object-path-immutable';

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

    const handleChange = useCallback(
      (val) => {
        const path = [...parents, name].join('.');
        const fullPath = `${actionName}.${path}`;
        dispatch({
          actionId,
          objPath: fullPath,
          type: 'setActionOptions',
          val,
        });
        // setActionOptions(actionId, fullPath, val);
      },
      [actionId, actionName, dispatch, name, parents],
    );

    const path = [...parents, name].join('.');

    const action = state.storyActions.find((x) => x.id === actionId);
    let value = undefined;
    if (action && action.actions && action.actions[actionName])
      value = immutableObject.get(action.actions[actionName], path);

    // console.log(`${actionName}.${path}`, value);

    return useMemo(() => {
      if (schema.enum) {
        return (
          <ControlForm
            label={name}
            type="select"
            onChange={handleChange}
            options={schema.enum as string[]}
            value={value}
          />
        );
      }

      switch (schema.type) {
        case 'string':
          return (
            <ControlForm
              label={name}
              type="text"
              onChange={handleChange}
              value={value}
            />
          );
        case 'number':
        case 'integer':
          return (
            <ControlForm
              label={name}
              type="number"
              onChange={handleChange}
              value={value}
            />
          );
        case 'boolean':
          return (
            <ControlForm
              label={name}
              type="boolean"
              onChange={handleChange}
              value={value}
            />
          );
        case 'array': {
          if (!schema.items) return null;
          const items = (schema.items as Definition).enum;
          if (!items) return null;
          return (
            <ControlForm
              label={name}
              type="options"
              onChange={handleChange}
              display="inline-check"
              options={items as string[]}
              value={value}
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
      handleChange,
      name,
      parents,
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
