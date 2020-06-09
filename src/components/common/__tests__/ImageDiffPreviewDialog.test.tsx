import { ImageDiffPreviewDialog } from '../ImageDiffPreviewDialog';
import { shallow } from 'enzyme';
import React from 'react';
describe('ImageDiffPreviewDialog', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ImageDiffPreviewDialog imageDiffResult={{ pass: true }} open={true} />,
    );
    expect(wrapper).toHaveLength(1);
  });
});
