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

  it('should click on elements with clickable class name ', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <ListItemWrapper
        onClick={onClickMock}
        tooltip={'foo-tooltip'}
        title="foo"
      >
        <div className="content">test</div>
      </ListItemWrapper>,
    );

    wrapper
      .props()
      .onClick({ target: { classList: { contains: () => true } } } as never);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
