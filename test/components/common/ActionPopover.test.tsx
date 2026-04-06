import { ActionPopover } from '../../../src/components/common/ActionPopover';
import { shallow } from 'enzyme';
import React from 'react';

describe('ActionPopover', () => {
  const OnCloseMock = vi.fn();
  afterEach(() => {
    OnCloseMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionPopover onClose={OnCloseMock} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
