import '../../../../__manual_mocks__/react-useEffect';
import { storyData } from '../../../../__test_data__/story-data';
import { ScreenshotListPreviewDialog } from '../ScreenshotListPreviewDialog';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../__test_data__/get-screenshot-date';
import { SortableScreenshotListItem } from '../ScreenshotListItem';
import { act } from 'react-dom/test-utils';
import { ImageDiffPreview } from '../../common';
// import * as useKeyPressFn from '../../../hooks/use-key-press-fn';
import { useKeyPressFn } from '../../../hooks/use-key-press-fn';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../store/screenshot/context');
jest.mock('../../../hooks/use-key-press-fn');

describe('ScreenshotListPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListPreviewDialog
        open={true}
        screenshots={[getScreenshotDate()]}
        storyData={storyData}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should select first item on mount', () => {
    const wrapper = shallow(
      <ScreenshotListPreviewDialog
        open={true}
        screenshots={[
          getScreenshotDate(),
          getScreenshotDate({ id: 'screenshot-id-2', index: 1 }),
        ]}
        storyData={storyData}
      />,
    );
    const item = wrapper.find(SortableScreenshotListItem);
    expect(item).toHaveLength(2);
    expect(item.first().props().selected).toBeTruthy();
    expect(wrapper.find(ImageDiffPreview)).toHaveLength(1);
  });

  it('should find selected item', () => {
    const wrapper = shallow(
      <ScreenshotListPreviewDialog
        open={true}
        screenshots={[
          getScreenshotDate(),
          getScreenshotDate({ id: 'screenshot-id-2', index: 1 }),
        ]}
        storyData={storyData}
        selectedItem={'screenshot-id-2'}
      />,
    );
    const item = wrapper.find(SortableScreenshotListItem);
    expect(item).toHaveLength(2);
    expect(item.last().props().selected).toBeTruthy();
  });

  it('should change selected item', async () => {
    const wrapper = shallow(
      <ScreenshotListPreviewDialog
        open={true}
        screenshots={[
          getScreenshotDate(),
          getScreenshotDate({
            browserType: 'chromium',
            id: 'screenshot-id-2',
            index: 1,
          }),
        ]}
        storyData={storyData}
      />,
    );
    const items = wrapper.find(SortableScreenshotListItem);
    expect(items.last().props().selected).toBeFalsy();

    act(() => {
      items.last().props().onClick({
        browserType: 'chromium',
        id: 'screenshot-id-2',
        title: 'title',
      });
    });

    await new Promise((resolve) => setImmediate(resolve));
    expect(
      wrapper.find(SortableScreenshotListItem).last().props().selected,
    ).toBeTruthy();
  });

  it('should do nothing on arrow key press', async () => {
    let keyUpEv: (ev: KeyboardEvent) => void;

    mocked(useKeyPressFn).mockImplementation((_keyDown, keyUp) => {
      keyUpEv = keyUp;
    });

    const wrapper = shallow(
      <ScreenshotListPreviewDialog
        open={true}
        screenshots={[]}
        storyData={storyData}
      />,
    );

    act(() => {
      keyUpEv({ key: 'ArrowDown' } as KeyboardEvent);
    });

    const items = wrapper.find(SortableScreenshotListItem);
    expect(items.length).toBe(0);
  });

  it('should handle arrow key press', async () => {
    let keyUpEv: (ev: KeyboardEvent) => void;

    mocked(useKeyPressFn).mockImplementation((_keyDown, keyUp) => {
      keyUpEv = keyUp;
    });

    const wrapper = shallow(
      <ScreenshotListPreviewDialog
        open={true}
        screenshots={[
          getScreenshotDate(),
          getScreenshotDate({ id: 'screenshot-id-2', index: 1 }),
        ]}
        storyData={storyData}
      />,
    );

    act(() => {
      keyUpEv({ key: 'ArrowDown' } as KeyboardEvent);
    });

    let items = wrapper.find(SortableScreenshotListItem);
    expect(items.last().props().selected).toBeTruthy();

    act(() => {
      keyUpEv({ key: 'ArrowUp' } as KeyboardEvent);
    });

    items = wrapper.find(SortableScreenshotListItem);
    expect(items.first().props().selected).toBeTruthy();

    act(() => {
      keyUpEv({ key: 'Enter' } as KeyboardEvent);
    });
    // no change because f enter key
    items = wrapper.find(SortableScreenshotListItem);
    expect(items.first().props().selected).toBeTruthy();
  });
});
