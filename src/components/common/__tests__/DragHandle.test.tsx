import { DragHandle } from '../DragHandle';
import { shallow } from 'enzyme';
import React from 'react';

describe('DragHandle', () => {
  it('should render', () => {
    const wrapper = shallow(<DragHandle />, { disableLifecycleMethods: true })
      .first()
      .shallow();
    expect(wrapper.exists()).toBeTruthy();
  });
});
