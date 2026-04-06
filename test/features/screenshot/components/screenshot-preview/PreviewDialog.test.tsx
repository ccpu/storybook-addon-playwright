import { PreviewDialog } from '../../../../../src/features/screenshot/components/screenshot-preview/PreviewDialog';
import { shallow } from 'enzyme';
import React from 'react';
describe('PreviewDialog', () => {
  it('should render', () => {
    const wrapper = shallow(<PreviewDialog onClose={vi.fn()} open={true} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
