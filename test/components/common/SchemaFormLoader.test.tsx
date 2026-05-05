// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('../../../src/api/trpc/client', async () => {
  const React = await import('react');
  const { getSchema } = await import(
    '../../api/trpc/clients/__mocks__/schema.client'
  );

  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      schema: {
        getSchema: {
          useMutation: () => {
            const [data, setData] = React.useState<unknown>(undefined);
            const mutateAsync = async (input: unknown) => {
              const result = await getSchema(input as never);
              setData(result);
              return result;
            };

            return {
              data,
              isPending: false,
              mutate: (input: unknown) => {
                void mutateAsync(input);
              },
              mutateAsync,
              reset: vi.fn(),
            };
          },
        },
      },
    },
  };
});
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import '../../manual-mocks/react-useEffect';

import { SchemaFormLoader } from '../../../src/components/common/SchemaFormLoader';
import { shallow } from 'enzyme';
import React from 'react';

import { Button } from '@material-ui/core';
import { MemoizedSchemaRenderer } from '../../../src/features/schema/components/index';
import { getSchema } from '../../api/trpc/clients/__mocks__/schema.client';

vi.mock('../../../src/api/trpc/clients/schema.client');

describe('SchemaFormLoader', () => {
  beforeEach(() => {
    vi.mocked(getSchema).mockResolvedValue({} as never);
  });

  it('should change value and save', async () => {
    const onSaveMock = vi.fn();
    const wrapper = shallow(
      <SchemaFormLoader schemaName="MyType" onSave={onSaveMock} />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    wrapper.find(MemoizedSchemaRenderer).props().onChange('click', true);

    wrapper
      .find(Button)
      .last()
      .props()
      .onClick?.({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(onSaveMock).toHaveBeenCalledWith({ click: true });
  });

  it('should get value', async () => {
    const onSaveMock = vi.fn();
    const wrapper = shallow(
      <SchemaFormLoader schemaName="MyType" onSave={onSaveMock} />,
    );

    await new Promise((resolve) => setImmediate(resolve));
    wrapper.find(MemoizedSchemaRenderer).props().onChange('click', true);
    const val = wrapper
      .find(MemoizedSchemaRenderer)
      .props()
      .getValue('click', {});

    expect(val).toBe(true);
  });

  it('should handle clear', async () => {
    const onSaveMock = vi.fn();
    const wrapper = shallow(
      <SchemaFormLoader schemaName="MyType" onSave={onSaveMock} />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    wrapper.find(MemoizedSchemaRenderer).props().onChange('click', true);

    wrapper
      .find(Button)
      .first()
      .props()
      .onClick?.({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(onSaveMock).toHaveBeenCalledWith({});
  });
});
