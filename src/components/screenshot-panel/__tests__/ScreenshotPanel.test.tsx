import '../../../../__manual_mocks__/react-useEffect';
import { ScreenshotPanel } from '../ScreenshotPanel';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotDispatch } from '../../../store/screenshot/context';
import { mocked } from 'ts-jest/utils';
import { ScreenshotListToolbar } from '../ScreenshotListToolbar';
import { StoryScreenshotPreview } from '../StoryScreenshotPreview';
import mockConsole from 'jest-mock-console';

jest.mock('../../../utils/get-iframe.ts');
jest.mock('../../../store/screenshot/context');

describe('ScreenshotPanel', () => {
  let restoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const dispatchMock = jest.fn();
    mocked(useScreenshotDispatch).mockImplementationOnce(() => dispatchMock);
    const wrapper = shallow(<ScreenshotPanel />);
    expect(wrapper.exists()).toBeTruthy();
    expect(dispatchMock).toHaveBeenCalledWith({
      state: false,
      type: 'pauseDeleteImageDiffResult',
    });
  });

  it('should show StoryScreenshotPreview', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onPreviewClick();

    expect(StoryScreenshotPreview).toHaveLength(1);
  });

  it('should StoryScreenshotPreview to preform update', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onUpdateClick();

    expect(StoryScreenshotPreview).toHaveLength(1);
  });
});
