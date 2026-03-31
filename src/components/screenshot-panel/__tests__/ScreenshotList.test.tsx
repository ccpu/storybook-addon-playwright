import { ScreenshotList } from '../ScreenshotList';
import { shallow } from 'enzyme';
import React from 'react';
import { SortableScreenshotListItem } from '../ScreenshotListItem';
import { useScreenshotContext } from '../../../store/screenshot/context';

vi.mock('../../../store/screenshot/context');
vi.mock('../../../hooks/use-current-story-data');
vi.mock('../../../hooks/use-screenshot-imageDiff-results.ts');

const useScreenshotContextMock = vi.mocked(useScreenshotContext);

describe('ScreenshotList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ScreenshotList />);
    expect(wrapper.exists()).toBeTruthy();
    const items = wrapper.find(SortableScreenshotListItem);
    expect(items).toHaveLength(2);
    expect(items.first().props().imageDiffResult).toStrictEqual({
      pass: true,
      screenshotId: 'screenshot-id',
    });
  });

  it('should show no data message', () => {
    useScreenshotContextMock.mockImplementationOnce(() => ({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id-3' }],
      pauseDeleteImageDiffResult: false,
      screenshots: [],
    }));
    const wrapper = shallow(<ScreenshotList />);

    expect(wrapper.find('div').first().text()).toBe(
      'No screenshot has been found!',
    );
  });
});
