import { FormControl } from '../FormControl';
import { shallow } from 'enzyme';
import React from 'react';
import CheckSelected from '@mui/icons-material/CheckCircleOutlineRounded';

describe('FormControl', () => {
  const onAppendValueToTitleMock = jest.fn();

  it('should render', () => {
    const wrapper = shallow(
      <FormControl
        appendValueToTitle={false}
        isRequired={false}
        label="foo"
        onAppendValueToTitle={onAppendValueToTitleMock}
        description="desc"
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have star for required', () => {
    const wrapper = shallow(
      <FormControl
        appendValueToTitle={false}
        isRequired={true}
        label="foo"
        onAppendValueToTitle={onAppendValueToTitleMock}
        description="desc"
      />,
    );
    expect(wrapper.find('.form-label').text()).toBe('Foo*');
  });

  it('should handle appendValueToTitle', () => {
    const wrapper = shallow(
      <FormControl
        appendValueToTitle={true}
        isRequired={true}
        label="foo"
        onAppendValueToTitle={onAppendValueToTitleMock}
        description="desc"
      />,
    );
    expect(wrapper.find(CheckSelected)).toHaveLength(1);
  });
});
