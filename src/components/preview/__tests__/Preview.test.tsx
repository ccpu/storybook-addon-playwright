import { Preview } from '../Preview';
import { shallow } from 'enzyme';
import React from 'react';
import { useAddonState } from '../../../hooks/use-addon-state';
import { AddonState } from '../../../typings';
import { ScreenshotListView } from '../../screenshot-preview';
import SplitPane from 'react-split-pane';

jest.mock('../../../hooks/use-addon-state.ts');
(useAddonState as jest.Mock).mockImplementation(() => ({
  addonState: {
    previewPanelEnabled: true,
  } as AddonState,
}));

describe('Preview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(<Preview />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should nothing addonState not set yet', () => {
    (useAddonState as jest.Mock).mockImplementationOnce(() => ({
      addonState: undefined,
    }));
    const wrapper = shallow(<Preview />);
    expect(wrapper.type()).toBe(React.Fragment);
  });

  it('should preview panel horizontal', () => {
    const wrapper = shallow(<Preview />);

    expect(wrapper.find(SplitPane).props().split).toBe('horizontal');

    expect(wrapper.find(ScreenshotListView)).toHaveLength(1);
    expect(wrapper.find(ScreenshotListView).props().column).toBe(undefined);
  });

  it('should preview panel vertical', () => {
    (useAddonState as jest.Mock).mockImplementationOnce(() => ({
      addonState: {
        placement: 'right',
        previewPanelEnabled: true,
      } as AddonState,
    }));
    const wrapper = shallow(<Preview />);

    expect(wrapper.find(SplitPane).props().split).toBe('vertical');
    expect(wrapper.find(ScreenshotListView).props().column).toBe(1);
  });

  it('should be notInteractive when split pane drag ', () => {
    const wrapper = shallow(<Preview />);

    expect(
      wrapper
        .find('.preview-main')
        .props()
        .className.split(' ')
        .find((x) => x.indexOf('interactive') !== -1),
    ).toBeTruthy();

    wrapper.find(SplitPane).props().onDragStarted();

    expect(
      wrapper
        .find('.preview-main')
        .props()
        .className.split(' ')
        .find((x) => x.indexOf('notInteractive') !== -1),
    ).toBeTruthy();

    wrapper.find(SplitPane).props().onDragFinished(2);

    expect(
      wrapper
        .find('.preview-main')
        .props()
        .className.split(' ')
        .find((x) => x.indexOf('interactive') !== -1),
    ).toBeTruthy();
  });

  it('should handle resize change', () => {
    const setAddonState = jest.fn();

    (useAddonState as jest.Mock).mockImplementationOnce(() => ({
      addonState: {
        previewPanelEnabled: true,
      },
      setAddonState,
    }));

    const wrapper = shallow(<Preview />);

    wrapper.find(SplitPane).props().onChange(50);

    expect(setAddonState).toHaveBeenCalledWith({
      previewPanelEnabled: true,
      previewPanelSize: 50,
    });
  });

  it('should handle closing browser screenshot preview panel', () => {
    const setAddonState = jest.fn();

    (useAddonState as jest.Mock).mockImplementationOnce(() => ({
      addonState: {
        previewPanelEnabled: true,
      } as AddonState,
      setAddonState,
    }));

    const wrapper = shallow(<Preview />);

    wrapper.find(ScreenshotListView).props().onClose();

    expect(setAddonState).toHaveBeenCalledWith({ previewPanelEnabled: false });
  });
});
