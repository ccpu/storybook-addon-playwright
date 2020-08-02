import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import React from 'react';
import { ActionList, SortableList, SortableItem } from '../ActionList';
import { shallow } from 'enzyme';
import { SortEnd, SortEvent } from 'react-sortable-hoc';

jest.mock('../../../hooks/use-current-story-data.ts');

describe('ActionList', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
  });

  it('should mount', () => {
    const wrapper = shallow(
      <ActionList
        actionSet={{
          actions: [{ id: 'action-id', name: 'action-name' }],
          id: 'action-set-id',
          title: 'action-set-desc',
        }}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(SortableList).exists()).toBeTruthy();
  });

  it('should show error if no actions provided', () => {
    const wrapper = shallow(
      <ActionList
        actionSet={{
          actions: [],
          id: 'action-set-id',
          title: 'action-set-desc',
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
          id: 'action-set-id',
          title: 'action-set-desc',
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
        actionSetId="action-set-id"
      />,
      { disableLifecycleMethods: true },
    )
      .first()
      .shallow();

    const items = wrapper.find(SortableItem);

    expect(items).toHaveLength(2);
  });
});
