import { CheckBox } from '../CheckBox';
import { shallow } from 'enzyme';
import React from 'react';
import CheckBoxUnchecked from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxChecked from '@mui/icons-material/CheckBox';

describe('CheckBox', () => {
  it('should render', () => {
    const wrapper = shallow(<CheckBox onClick={jest.fn()} checked={false} />);
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(CheckBoxUnchecked)).toHaveLength(1);
  });
  it('should check', () => {
    const wrapper = shallow(<CheckBox onClick={jest.fn()} checked={true} />);
    expect(wrapper.find(CheckBoxChecked)).toHaveLength(1);
  });
});
