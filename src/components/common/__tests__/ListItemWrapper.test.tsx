import { ListItemWrapper } from '../ListItemWrapper';
import { shallow } from 'enzyme';
import React from 'react';
import { DragHandle } from '../DragHandle';

describe('ListItemWrapper', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ListItemWrapper tooltip={'foo-tooltip'} title="foo" />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
  it('should have drag handle', () => {
    const wrapper = shallow(
      <ListItemWrapper tooltip={'foo-tooltip'} title="foo" draggable />,
    );
    expect(wrapper.find(DragHandle)).toHaveLength(1);
  });
});
