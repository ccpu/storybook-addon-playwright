import { ActionToolbar } from '../ActionSetToolbar';
import { shallow } from 'enzyme';
import React from 'react';

describe('ActionToolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={vi.fn()}
        onReset={vi.fn()}
        onFavoriteActionsClick={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
