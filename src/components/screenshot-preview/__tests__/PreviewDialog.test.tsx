import { PreviewDialog } from '../PreviewDialog';
import { shallow } from 'enzyme';
import React from 'react';
describe('PreviewDialog', () => {
  it('should render', () => {
    const wrapper = shallow(<PreviewDialog onClose={jest.fn()} open={true} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
