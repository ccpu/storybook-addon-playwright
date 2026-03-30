import '../../../../__manual_mocks__/react-useEffect';
import { getActionSchemaData } from '../../../../__test_data__';
import { SchemaFormLoader } from '../SchemaFormLoader';
import { shallow } from 'enzyme';
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { getSchema } from '../../../features/schema/schema.client';
import { Button } from '@material-ui/core';
import { MemoizedSchemaRenderer } from '../../schema';

jest.mock('../../../features/schema/schema.client');

const schema = getActionSchemaData();

describe('SchemaFormLoader', () => {
  beforeEach(() => {
    mocked(getSchema).mockResolvedValue(schema as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <SchemaFormLoader schemaName="MyType" onSave={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(getSchema).toHaveBeenCalledWith({ schemaName: 'MyType' });
  });

  it('should change value and save', async () => {
    const onSaveMock = jest.fn();
    const wrapper = shallow(
      <SchemaFormLoader schemaName="MyType" onSave={onSaveMock} />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    wrapper.find(MemoizedSchemaRenderer).props().onChange('click', true);

    wrapper
      .find(Button)
      .last()
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(onSaveMock).toHaveBeenCalledWith({ click: true });
  });

  it('should get value', async () => {
    const onSaveMock = jest.fn();
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
    const onSaveMock = jest.fn();
    const wrapper = shallow(
      <SchemaFormLoader schemaName="MyType" onSave={onSaveMock} />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    wrapper.find(MemoizedSchemaRenderer).props().onChange('click', true);

    wrapper
      .find(Button)
      .first()
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(onSaveMock).toHaveBeenCalledWith({});
  });
});
