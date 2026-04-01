import { ScreenshotListSortable } from '../ScreenshotListSortable';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotIndexChange } from '../../../hooks/use-screenshot-index-change';
import { useDragStart } from '../../../../../hooks/use-drag-start';
import { ListWrapperSortableContainer } from '../../../../../components/common';
import { SortEnd, SortEvent, SortStart } from 'react-sortable-hoc';

vi.mock('../../../hooks/use-screenshot-index-change');
vi.mock('../../../../../hooks/use-drag-start');

describe('ScreenshotListSortable', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotListSortable />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle sort start', () => {
    const sortStartMock = vi.fn();

    (useDragStart as Mock).mockImplementationOnce(() => ({
      setDragStart: sortStartMock,
    }));

    const wrapper = shallow(<ScreenshotListSortable />);

    const listWrapper = wrapper.find(ListWrapperSortableContainer);

    listWrapper.props().updateBeforeSortStart({} as SortStart, {} as SortEvent);

    expect(sortStartMock).toHaveBeenCalledWith(true);
  });

  it('should handle sort end', () => {
    const sortEndMock = vi.fn();

    (useScreenshotIndexChange as Mock).mockImplementationOnce(() => ({
      ChangeIndexErrorSnackbar: () => <div />,
      ChangeIndexInProgress: false,
      changeIndex: sortEndMock,
    }));

    const wrapper = shallow(<ScreenshotListSortable />);

    const listWrapper = wrapper.find(ListWrapperSortableContainer);

    listWrapper
      .props()
      .onSortEnd({ newIndex: 1, oldIndex: 0 } as SortEnd, {} as SortEvent);

    expect(sortEndMock).toHaveBeenCalledWith({ newIndex: 1, oldIndex: 0 });
  });
});
