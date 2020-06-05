import { ScreenshotList } from '../ScreenshotList';
import { shallow } from 'enzyme';
import React from 'react';
import { SortableScreenshotListItem } from '../ScreenshotListItem';
import { useScreenshotContext } from '../../../store/screenshot/context';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../store/screenshot/context');
jest.mock('../../../hooks/use-current-story-data');
const useScreenshotContextMock = mocked(useScreenshotContext);

describe('ScreenshotList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ScreenshotList />);
    expect(wrapper.exists()).toBeTruthy();
    const items = wrapper.find(SortableScreenshotListItem);
    expect(items).toHaveLength(2);
    expect(items.first().props().imageDiffResult).toStrictEqual({
      pass: true,
      screenshotHash: 'hash',
    });
  });

  it('should show no data message', () => {
    useScreenshotContextMock.mockImplementationOnce(() => ({
      imageDiffResults: [{ pass: true, screenshotHash: 'hash' }],
      pauseDeleteImageDiffResult: false,
      screenshots: [],
    }));
    const wrapper = shallow(<ScreenshotList />);

    expect(wrapper.find('div').first().text()).toBe(
      'No screenshot has been found!',
    );
  });
});
