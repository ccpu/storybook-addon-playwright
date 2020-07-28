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
});
