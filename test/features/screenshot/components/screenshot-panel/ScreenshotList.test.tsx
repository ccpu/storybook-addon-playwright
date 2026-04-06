import { ScreenshotList } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotList';
import { shallow } from 'enzyme';
import React from 'react';
import { SortableScreenshotListItem } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListItem';
import { useScreenshotStoreState } from '../../../../../src/features/screenshot/store/selectors';

vi.mock(
  '../../../../../src/features/screenshot/store/selectors',
  async () => await import('../../store/__mocks__/context'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results',
  async () =>
    await import('../../hooks/__mocks__/use-screenshot-imageDiff-results'),
);

const useScreenshotStoreStateMock = vi.mocked(useScreenshotStoreState);

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
    useScreenshotStoreStateMock.mockImplementationOnce(() => ({
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
