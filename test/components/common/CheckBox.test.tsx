import { CheckBox } from '../../../src/components/common/CheckBox';
import { shallow } from 'enzyme';
import React from 'react';
import { FormIcon, StopAltHollowIcon } from '@storybook/icons';

describe('CheckBox', () => {
  it('should render', () => {
    const wrapper = shallow(<CheckBox onClick={vi.fn()} checked={false} />);
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(StopAltHollowIcon)).toHaveLength(1);
  });

  it('should check', () => {
    const wrapper = shallow(<CheckBox onClick={vi.fn()} checked={true} />);
    expect(wrapper.find(FormIcon)).toHaveLength(1);
  });
});
