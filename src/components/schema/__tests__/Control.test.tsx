import { Control } from '../Control';
import { shallow } from 'enzyme';
import React from 'react';

describe('Control', () => {
  const onChangeMock = jest.fn();
  const onAppendValueToTitleMock = jest.fn();

  beforeAll(() => {
    onChangeMock.mockClear();
    onAppendValueToTitleMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <Control
        onChange={onChangeMock}
        label="foo"
        value="bar"
        type="text"
        appendValueToTitle={false}
        onAppendValueToTitle={onAppendValueToTitleMock}
        isRequired={false}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should be active', () => {
    const wrapper = shallow(
      <Control
        onChange={onChangeMock}
        label="foo"
        value="bar"
        type="text"
        appendValueToTitle={false}
        onAppendValueToTitle={onAppendValueToTitleMock}
        isRequired={false}
      />,
    );
    expect(wrapper.props().active).toBe(true);
  });

  it('should not active if default value is same as value', () => {
    const wrapper = shallow(
      <Control
        onChange={onChangeMock}
        label="foo"
        value="bar"
        type="text"
        appendValueToTitle={false}
        onAppendValueToTitle={onAppendValueToTitleMock}
        isRequired={false}
        defaultValue="bar"
      />,
    );
    expect(wrapper.props().active).toBe(false);
  });

  it('should not active if value is false', () => {
    const wrapper = shallow(
      <Control
        onChange={onChangeMock}
        label="foo"
        value={false}
        type="text"
        appendValueToTitle={false}
        onAppendValueToTitle={onAppendValueToTitleMock}
        isRequired={false}
      />,
    );
    expect(wrapper.props().active).toBe(false);
  });

  it('should not active if value is empty string', () => {
    const wrapper = shallow(
      <Control
        onChange={onChangeMock}
        label="foo"
        value={''}
        type="text"
        appendValueToTitle={false}
        onAppendValueToTitle={onAppendValueToTitleMock}
        isRequired={false}
      />,
    );
    expect(wrapper.props().active).toBe(false);
  });
});
