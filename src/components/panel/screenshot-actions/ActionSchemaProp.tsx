import React, { SFC, useCallback, memo } from 'react';
import { Definition } from 'ts-to-json';
import { Control } from './Control';
import { ActionSchemaProps } from './ActionSchemaProps';
import { useActionDispatchContext } from '../../../store';
import { getActionOptionValue } from './utils';
import { SelectorControl } from './SelectorControl';
import { useAction } from '../../../hooks';

export interface ActionSchemaPropProps {
  name: string;
  parents?: string[];
  schema: Definition;
  actionName: string;
  actionId: string;
  nextPropName: string;
}

const ActionSchemaProp: SFC<ActionSchemaPropProps> = memo(
  ({ name, schema, parents = [], actionName, actionId, nextPropName }) => {
    const dispatch = useActionDispatchContext();
    const optionObjectPath = [...parents, name].join('.');
    const fullObjectPath = `${actionName}.${optionObjectPath}`;

    const handleChange = useCallback(
      (val) => {
        dispatch({
          actionId,
          objPath: fullObjectPath,
          type: 'setActionOptions',
          val,
        });
      },
      [actionId, dispatch, fullObjectPath],
    );

    const handleAppendToTile = useCallback(() => {
      dispatch({
        actionId,
        actionOptionPath: optionObjectPath,
        type: 'toggleSubtitleItem',
      });
    }, [actionId, dispatch, optionObjectPath]);

    const action = useAction(actionId);

    if (!action) return null;

    const value = getActionOptionValue(action, actionName, optionObjectPath);
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
          fullObjectPath={fullObjectPath}
          actionId={actionId}
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
  },
);

ActionSchemaProp.displayName = 'ActionSchemaProp';

export { ActionSchemaProp };
