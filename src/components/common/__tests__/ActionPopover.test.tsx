import { ActionPopover } from '../ActionPopover';
import { shallow } from 'enzyme';
import React from 'react';

describe('ActionPopover', () => {
  const OnCloseMock = jest.fn();
  afterEach(() => {
    OnCloseMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionPopover onClose={OnCloseMock} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
