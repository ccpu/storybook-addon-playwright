import React, { SFC, useCallback } from 'react';
import { SchemaRenderer } from './SchemaRenderer';
import { Control } from './Control';
import { SelectorControl } from './SelectorControl';
import { ActionSchema } from '../../typings';
import { capitalize } from '@material-ui/core';
import startCase from 'lodash/startCase';

export interface SchemaPropProps {
  name: string;
  parents?: string[];
  schema: ActionSchema;
  nextPropName: string;
  isRequired?: boolean;
  onChange: (objPath: string, val: unknown) => void;
  getValue: (optionObjectPath: string, schema: ActionSchema) => unknown;
  shouldAppendToTitle?: (optionObjectPath: string) => boolean;
  onAppendValueToTitle?: (optionObjectPath: string) => void;
  onSelectorChange?: (objPath: string, val: unknown) => void;
}

const SchemaProp: SFC<SchemaPropProps> = ({
  name,
  schema,
  parents = [],
  nextPropName,
  isRequired,
  onChange,
  getValue,
  shouldAppendToTitle,
  onAppendValueToTitle,
  onSelectorChange,
}) => {
  const optionObjectPath = [...parents, name].join('.');

  const handleChange = useCallback(
    (val) => {
      onChange(optionObjectPath, val);
    },
    [onChange, optionObjectPath],
  );

  const value = schema.type !== 'object' && getValue(optionObjectPath, schema);

  const appendToTile =
    shouldAppendToTitle && shouldAppendToTitle(optionObjectPath);

  const handleOnAppendValueToTitle = useCallback(() => {
    onAppendValueToTitle(optionObjectPath);
  }, [onAppendValueToTitle, optionObjectPath]);

  if (
    onSelectorChange &&
    (name === 'selector' ||
      (schema.type === 'number' &&
        ['x', 'y', 'top', 'left'].indexOf(name) !== -1))
  ) {
    return (
      <SelectorControl
        label={name}
        type={name === 'selector' ? 'text' : 'number'}
        onChange={handleChange}
        selectorType={name === 'selector' ? 'selector' : 'position'}
        value={value}
        description={schema.description}
        onAppendValueToTitle={
          onAppendValueToTitle && handleOnAppendValueToTitle
        }
        appendValueToTitle={appendToTile}
        isFollowedByPositionProp={nextPropName === 'x' || nextPropName === 'y'}
        fullObjectPath={optionObjectPath}
        isRequired={isRequired}
        onSelectorChange={onSelectorChange}
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
        onAppendValueToTitle={
          onAppendValueToTitle && handleOnAppendValueToTitle
        }
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
          onAppendValueToTitle={
            onAppendValueToTitle && handleOnAppendValueToTitle
          }
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
          onAppendValueToTitle={
            onAppendValueToTitle && handleOnAppendValueToTitle
          }
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
          onAppendValueToTitle={
            onAppendValueToTitle && handleOnAppendValueToTitle
          }
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
          onAppendValueToTitle={
            onAppendValueToTitle && handleOnAppendValueToTitle
          }
          appendValueToTitle={appendToTile}
          isRequired={isRequired}
        />
      );
    }
    case 'object':
      return (
        <div
          style={{
            marginBottom: 6,
          }}
        >
          <p style={{ margin: '6px 0', marginTop: 14 }}>
            {capitalize(startCase(name).toLowerCase())}:
          </p>
          <div style={{ paddingLeft: 12 }}>
            <SchemaRenderer
              schemaProps={schema.properties}
              parents={[...parents, name]}
              required={schema.required}
              onChange={onChange}
              getValue={getValue}
              shouldAppendToTitle={shouldAppendToTitle}
              onAppendValueToTitle={onAppendValueToTitle}
              onSelectorChange={onSelectorChange}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

SchemaProp.displayName = 'SchemaProp';

const MemoizedSchemaProp = React.memo(SchemaProp);
export { SchemaProp, MemoizedSchemaProp };
