import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import { ActionSchemaProp } from '../ActionSchemaProp';
import { shallow } from 'enzyme';
import React from 'react';
import { getActionSchemaData } from '../../../../__test_data__/action-schema';
import { useEditorAction } from '../../../hooks/use-editor-action';
import { SelectorControl } from '../SelectorControl';
import { Control } from '../Control';
import { ActionSchemaProps } from '../ActionSchemaProps';

const schema = getActionSchemaData();

jest.mock('../../../hooks/use-editor-action', () => ({
  useEditorAction: jest.fn(),
}));

describe('ActionSchemaProp', () => {
  const defaultMockData = {
    args: { selector: 'html' },
    id: 'action-id',
    name: 'click',
  };

  beforeEach(() => {
    (useEditorAction as jest.Mock).mockImplementation(() => defaultMockData);
    dispatchMock.mockClear();
  });

  it('should not render if useEditorAction return nothing', () => {
    (useEditorAction as jest.Mock).mockImplementationOnce(() => undefined);
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="click"
        nextPropName="click"
        schema={schema['click']['parameters']['selector']}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render selector component when action name is selector', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="selector"
        nextPropName=""
        schema={schema['click']['parameters']['selector']}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is x', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="x"
        nextPropName=""
        schema={schema['click']['parameters']['selector']}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render selector component when action name is y', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="y"
        nextPropName=""
        schema={schema['click']['parameters']['selector']}
      />,
    );
    const selector = wrapper.find(SelectorControl);
    expect(selector).toHaveLength(1);
  });

  it('should render select control', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="list"
        nextPropName=""
        schema={{ enum: ['bar', 'foo'] }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().options).toHaveLength(2);
  });

  it('should render text control', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="string"
        nextPropName=""
        schema={{ type: 'string' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('text');
  });

  it('should render number control', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="num"
        nextPropName=""
        schema={{ type: 'number' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('number');
  });

  it('should render number control with integer type', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="num"
        nextPropName=""
        schema={{ type: 'integer' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('number');
  });

  it('should render boolean type control', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="bool"
        nextPropName=""
        schema={{ type: 'boolean' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('boolean');
  });

  it('should render array type control', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="array"
        nextPropName=""
        schema={{ items: { enum: ['bar', 'foo'] }, type: 'array' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(1);
    expect(control.props().type).toBe('options');
  });

  it('should not render array type control if schema items not provided', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="array"
        nextPropName=""
        schema={{ type: 'array' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(0);
  });

  it('should not render array type control if schema enum for items not provided', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="array"
        nextPropName=""
        schema={{ items: { enum: undefined }, type: 'array' }}
      />,
    );
    const control = wrapper.find(Control);
    expect(control).toHaveLength(0);
  });

  it('should start recursion if type is object', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="object"
        nextPropName=""
        schema={{ type: 'object' }}
      />,
    );
    const control = wrapper.find(ActionSchemaProps);
    expect(control).toHaveLength(1);
  });

  it('should render nothing if types not matched', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="null"
        nextPropName=""
        schema={{ type: 'null' }}
      />,
    );
    expect(wrapper.type()).toBe(null);
  });

  it('should handle handleAppendToTile ', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="string"
        nextPropName=""
        schema={{ type: 'string' }}
      />,
    );
    const control = wrapper.find(Control);
    control.props().onAppendValueToTitle();
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionId: 'action-id',
        actionOptionPath: 'string',
        type: 'toggleSubtitleItem',
      },
    ]);
  });

  it('should handle change ', () => {
    const wrapper = shallow(
      <ActionSchemaProp
        actionId="action-id"
        name="string"
        nextPropName=""
        schema={{ type: 'string' }}
      />,
    );
    const control = wrapper.find(Control);
    control.props().onChange('foo');
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionId: 'action-id',
        objPath: 'string',
        type: 'setActionOptions',
        val: 'foo',
      },
    ]);
  });
});
