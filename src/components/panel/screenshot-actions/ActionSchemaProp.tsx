import React, { SFC, useCallback, memo, useContext, useMemo } from 'react';
import { Definition } from 'ts-to-json';
import { ControlForm } from './ControlForm';
import { ActionSchemaProps } from './ActionSchemaProps';
import { ActionContext } from '../../../store';

export interface ActionSchemaPropProps {
  name: string;
  parents?: string[];
  schema: Definition;
  actionName: string;
  actionId: string;
}

const ActionSchemaProp: SFC<ActionSchemaPropProps> = memo(
  ({ name, schema, parents = [], actionName, actionId }) => {
    const { getActionOptionValue, setActionOptions } = useContext(
      ActionContext,
    );

    const handleChange = useCallback(
      (val) => {
        const path = [...parents, name].join('.');
        const fullPath = `${actionName}.${path}`;
        console.log(fullPath);
        setActionOptions(actionId, fullPath, val);
      },
      [actionId, actionName, name, parents, setActionOptions],
    );

    const path = [...parents, name].join('.');
    const value = getActionOptionValue(actionId, actionName, path);
    // console.log(`${actionName}.${path}`, value);

    return useMemo(() => {
      console.log('ActionSchemaProp');
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
