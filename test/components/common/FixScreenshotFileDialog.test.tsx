import React from 'react';
import { shallow } from 'enzyme';
import { FixScreenshotFileDialog } from '../../../src/components/common/FixScreenshotFileDialog';

describe('FixScreenshotFileDialog', () => {
  it('should be defined', () => {
    const wrapper = shallow(<FixScreenshotFileDialog />);

    expect(wrapper).toBeDefined();
  });
});
