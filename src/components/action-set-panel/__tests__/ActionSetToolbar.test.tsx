import { ActionToolbar } from '../ActionSetToolbar';
import { shallow } from 'enzyme';
import React from 'react';

describe('ActionToolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={jest.fn()}
        onReset={jest.fn()}
        onFavoriteActionsClick={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
