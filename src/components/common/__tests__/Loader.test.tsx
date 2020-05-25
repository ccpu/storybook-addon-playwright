import { Loader } from '../Loader';
import { shallow } from 'enzyme';
import React from 'react';
describe('Loader', () => {
  it('should render', () => {
    const wrapper = shallow(<Loader open={true} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
