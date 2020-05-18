import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import React from 'react';
import { ActionList, SortableList, SortableItem } from '../ActionList';
import { shallow } from 'enzyme';
import { SortEnd, SortEvent } from 'react-sortable-hoc';

describe('ActionList', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
  });

  it('should mount', () => {
    const wrapper = shallow(
      <ActionList
        actionSet={{
          actions: [{ id: 'action-id', name: 'action-name' }],
          description: 'action-set-desc',
          id: 'action-set-id',
        }}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(SortableList).exists()).toBeTruthy();
  });

  it('should show error id no actions provided', () => {
    const wrapper = shallow(
      <ActionList
        actionSet={{
          actions: [],
          description: 'action-set-desc',
          id: 'action-set-id',
        }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle sort end', () => {
    const wrapper = shallow(
      <ActionList
        actionSet={{
          actions: [{ id: 'action-id', name: 'action-name' }],
          description: 'action-set-desc',
          id: 'action-set-id',
        }}
      />,
    );
    const sortableList = wrapper.find(SortableList);

    sortableList
      .props()
      .onSortEnd({ newIndex: 1, oldIndex: 2 } as SortEnd, {} as SortEvent);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

  it('should have items', () => {
    const wrapper = shallow(
      <SortableList
        items={[
          { id: 'action-id-1', name: 'action-name-1' },
          { id: 'action-id-2', name: 'action-name-2' },
        ]}
      />,
      { disableLifecycleMethods: true },
    )
      .first()
      .shallow();

    const items = wrapper.find(SortableItem);

    expect(items).toHaveLength(2);
  });
});