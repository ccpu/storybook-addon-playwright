import { Preview } from '../../../src/components/preview/Preview';
import { shallow } from 'enzyme';
import React from 'react';
import { useAddonState } from '../../../src/hooks/use-addon-state';
import { AddonState } from '../../../src/typings';
import { ScreenshotListView } from '../../../src/features/screenshot/components/screenshot-preview/index';
import { SplitPane } from 'react-split-pane';

vi.mock(
  '../../../src/hooks/use-addon-state',
  async () => await import('../../hooks/__mocks__/use-addon-state'),
);
(useAddonState as Mock).mockImplementation(() => ({
  addonState: {
    previewPanelEnabled: true,
  } as AddonState,
}));

describe('Preview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(<Preview />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should nothing addonState not set yet', () => {
    (useAddonState as Mock).mockImplementationOnce(() => ({
      addonState: undefined,
    }));
    const wrapper = shallow(<Preview />);
    expect(wrapper.type()).toBe(React.Fragment);
  });

  it('should nothing when preview panel is disabled', () => {
    (useAddonState as Mock).mockImplementationOnce(() => ({
      addonState: {
        previewPanelEnabled: false,
      } as AddonState,
    }));

    const wrapper = shallow(<Preview />);

    expect(wrapper.type()).toBe(React.Fragment);
  });

  it('should preview panel horizontal', () => {
    const wrapper = shallow(<Preview />);

    expect(wrapper.find(SplitPane).props().direction).toBe('vertical');

    expect(wrapper.find(ScreenshotListView)).toHaveLength(1);
    expect(wrapper.find(ScreenshotListView).props().column).toBe(undefined);
  });

  it('should preview panel vertical', () => {
    (useAddonState as Mock).mockImplementationOnce(() => ({
      addonState: {
        placement: 'right',
        previewPanelEnabled: true,
      } as AddonState,
    }));
    const wrapper = shallow(<Preview />);

    expect(wrapper.find(SplitPane).props().direction).toBe('horizontal');
    expect(wrapper.find(ScreenshotListView).props().column).toBe(1);
  });

  it('should handle resize change', () => {
    const setAddonState = vi.fn();

    (useAddonState as Mock).mockImplementationOnce(() => ({
      addonState: {
        previewPanelEnabled: true,
      },
      setAddonState,
    }));

    const wrapper = shallow(<Preview />);

    const onResize = wrapper.find(SplitPane).props().onResize as
      | ((sizes: number[]) => void)
      | undefined;

    onResize?.([50, 50]);

    expect(setAddonState).toHaveBeenCalledWith({
      previewPanelEnabled: true,
      previewPanelSize: 50,
    });
  });

  it('should handle closing browser screenshot preview panel', () => {
    const setAddonState = vi.fn();

    (useAddonState as Mock).mockImplementationOnce(() => ({
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
