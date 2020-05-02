import React, { SFC, useCallback, memo, useContext } from 'react';
import { Definition } from 'ts-to-json';
import { ControlForm } from './ControlForm';
import { ActionSchemaProps } from './ActionSchemaProps';
import { ActionContext } from '../../../store';

export interface ActionSchemaPropProps {
  name: string;
  parents?: string[];
  schema: Definition;
  onChange: (key: string, val: unknown, parent) => void;
  actionName: string;
  actionId: string;
}

const ActionSchemaProp: SFC<ActionSchemaPropProps> = memo(
  ({ name, schema, onChange, parents = [], actionName, actionId }) => {
    const handleChange = useCallback(
      (val) => {
        onChange(name, val, parents);
      },
      [name, onChange, parents],
    );

    const { getActionOptionValue } = useContext(ActionContext);
    const path = [...parents, name].join('.');
    const value = getActionOptionValue(actionId, actionName, path);

    console.log(`${actionName}.${path}`, value);

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
            onChange={onChange}
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
