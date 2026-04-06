import { ActionToolbar } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetToolbar';
import { shallow } from 'enzyme';
import React from 'react';

describe('ActionToolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionToolbar
        onAddActionSet={vi.fn()}
        onDeleteSelectedActionSets={vi.fn()}
        onReset={vi.fn()}
        onFavoriteActionsClick={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
