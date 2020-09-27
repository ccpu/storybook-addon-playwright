import { SchemaProp } from '../SchemaProp';
import { shallow } from 'enzyme';
import React from 'react';
import { getActionSchemaData } from '../../../../__test_data__/action-schema';
import { SelectorControl } from '../SelectorControl';
import { Control } from '../Control';
import { SchemaRenderer } from '../SchemaRenderer';

const schema = getActionSchemaData();

describe('SchemaProp', () => {
  const onChangeMock = jest.fn();

  const getVal = () => {
    return null;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <SchemaProp
        schema={schema['click']['parameters']['selector']}
        onChange={onChangeMock}
        name="click"
        nextPropName="click"
        getValue={getVal}
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render selector component when action name is selector', () => {
    const wrapper = shallow(
      <SchemaProp
        getValue={getVal}
        name="selector"
        nextPropName=""
        schema={schema['click']['parameters']['selector']}
        onChange={onChangeMock}
        onSelectorChange={jest.fn()}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is x and type is number', () => {
    const wrapper = shallow(
      <SchemaProp
        name="x"
        nextPropName=""
        schema={{ type: 'number' }}
        onChange={onChangeMock}
        getValue={getVal}
        onSelectorChange={jest.fn()}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is y and type is number', () => {
    const wrapper = shallow(
      <SchemaProp
        name="y"
        nextPropName=""
        schema={{ type: 'number' }}
        onChange={onChangeMock}
        getValue={getVal}
        onSelectorChange={jest.fn()}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is top and type is number', () => {
    const wrapper = shallow(
      <SchemaProp
        name="top"
        nextPropName=""
        schema={{ type: 'number' }}
        onChange={onChangeMock}
        getValue={getVal}
        onSelectorChange={jest.fn()}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is left and type is number', () => {
    const wrapper = shallow(
      <SchemaProp
        name="left"
        nextPropName=""
        schema={{ type: 'number' }}
        onChange={onChangeMock}
        getValue={getVal}
        onSelectorChange={jest.fn()}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is left but type is no number', () => {
    const wrapper = shallow(
      <SchemaProp
        name="x"
        nextPropName=""
        schema={{ type: 'string' }}
        onChange={onChangeMock}
        getValue={getVal}
        onSelectorChange={jest.fn()}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(0);
  });

  it('should render select control', () => {
    const wrapper = shallow(
      <SchemaProp
        name="list"
        nextPropName=""
        schema={{ enum: ['bar', 'foo'] }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().options).toHaveLength(2);
  });

  it('should render text control', () => {
    const wrapper = shallow(
      <SchemaProp
        name="string"
        nextPropName=""
        schema={{ type: 'string' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('text');
  });

  it('should render number control', () => {
    const wrapper = shallow(
      <SchemaProp
        name="num"
        nextPropName=""
        schema={{ type: 'number' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('number');
  });

  it('should render number control with integer type', () => {
    const wrapper = shallow(
      <SchemaProp
        name="num"
        nextPropName=""
        schema={{ type: 'integer' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('number');
  });

  it('should render boolean type control', () => {
    const wrapper = shallow(
      <SchemaProp
        name="bool"
        nextPropName=""
        schema={{ type: 'boolean' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('boolean');
  });

  it('should render array type control', () => {
    const wrapper = shallow(
      <SchemaProp
        name="array"
        nextPropName=""
        schema={{ items: { enum: ['bar', 'foo'] }, type: 'array' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('options');
  });

  it('should not render array type control if schema items not provided', () => {
    const wrapper = shallow(
      <SchemaProp
        name="array"
        nextPropName=""
        schema={{ type: 'array' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(0);
  });

  it('should not render array type control if schema enum for items not provided', () => {
    const wrapper = shallow(
      <SchemaProp
        name="array"
        nextPropName=""
        schema={{ items: { enum: undefined }, type: 'array' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(0);
  });

  it('should start recursion if type is object', () => {
    const wrapper = shallow(
      <SchemaProp
        name="object"
        nextPropName=""
        schema={{ type: 'object' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(SchemaRenderer);
    expect(control).toHaveLength(1);
  });

  it('should render nothing if types not matched', () => {
    const wrapper = shallow(
      <SchemaProp
        name="null"
        nextPropName=""
        schema={{ type: 'null' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    expect(wrapper.type()).toBe(null);
  });

  it('should handle handleAppendToTile', () => {
    const onAppendValueToTitleMock = jest.fn();
    const wrapper = shallow(
      <SchemaProp
        name="string"
        nextPropName=""
        schema={{ type: 'string' }}
        onChange={onChangeMock}
        getValue={getVal}
        onAppendValueToTitle={onAppendValueToTitleMock}
      />,
    );
    const control = wrapper.find(Control);
    control.props().onAppendValueToTitle();

    expect(onAppendValueToTitleMock).toHaveBeenCalledWith('string');
  });

  it('should handle change', () => {
    const wrapper = shallow(
      <SchemaProp
        name="string"
        nextPropName=""
        schema={{ type: 'string' }}
        onChange={onChangeMock}
        getValue={getVal}
      />,
    );
    const control = wrapper.find(Control);
    control.props().onChange('foo');
    expect(onChangeMock).toHaveBeenLastCalledWith('string', 'foo');
  });
});
