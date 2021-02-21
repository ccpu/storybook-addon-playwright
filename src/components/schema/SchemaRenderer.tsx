import React from 'react';
import { ActionSchema } from '../../typings';
import { MemoizedSchemaProp } from './SchemaProp';

export interface SchemaRendererProps {
  schemaProps: ActionSchema;
  parents?: string[];
  required?: string[];
  onChange: (objPath: string, val: unknown) => void;
  getValue: (optionObjectPath: string, schema: ActionSchema) => unknown;
  shouldAppendToTitle?: (optionObjectPath: string) => boolean;
  onAppendValueToTitle?: (optionObjectPath: string) => void;
  onSelectorChange?: (objPath: string, val: unknown) => void;
}

const SchemaRenderer: React.FC<SchemaRendererProps> = ({
  schemaProps,
  required,
  parents = [],
  onChange,
  getValue,
  shouldAppendToTitle,
  onAppendValueToTitle,
  onSelectorChange,
}) => {
  return (
    <>
      {Object.keys(schemaProps).map((name, i, array) => {
        const param = schemaProps[name];
        return (
          <MemoizedSchemaProp
            key={name}
            name={name}
            schema={param}
            parents={parents}
            nextPropName={array[i + 1]}
            isRequired={required && required.indexOf(name) !== -1}
            onChange={onChange}
            getValue={getValue}
            shouldAppendToTitle={shouldAppendToTitle}
            onAppendValueToTitle={onAppendValueToTitle}
            onSelectorChange={onSelectorChange}
          />
        );
      })}
    </>
  );
};

SchemaRenderer.displayName = 'SchemaRenderer';

const MemoizedSchemaRenderer = React.memo(SchemaRenderer);
export { SchemaRenderer, MemoizedSchemaRenderer };
