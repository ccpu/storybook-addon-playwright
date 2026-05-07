import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import {
  Clipper,
  useClipperState,
} from '../../../src/components/Clipper/Clipper';
import {
  useBrowserOptions,
  useKeyPressFn,
  usePreviewIframe,
  useScreenshotOptions,
} from '../../../src/hooks';
import { getIframeScrollPosition } from '../../../src/utils';

const toastCustomMock = vi.hoisted(() => vi.fn());
const useAddonStateMock = vi.hoisted(() => vi.fn());

const overlayRect = {
  bottom: 1000,
  height: 1000,
  left: 10,
  right: 1000,
  toJSON: () => undefined,
  top: 15,
  width: 1000,
  x: 10,
  y: 15,
} as DOMRect;

const overlayElement = {
  getBoundingClientRect: () => overlayRect,
} as HTMLDivElement;

interface SelectoMockProps {
  onSelectEnd?: (event: { rect: DOMRect }) => void;
}

const selectoProps: { current?: SelectoMockProps } = {};

// Simulates a preview page with a visible vertical scrollbar:
// offsetWidth=800, clientWidth=785 (15px native OS scrollbar consuming space).
// Playwright headless uses overlay scrollbars so renders at the full 800px,
// which would shift horizontally-centered content by ~7-8 px without this fix.
const innerIframeDocument = {
  body: {
    offsetHeight: 1180,
    scrollHeight: 1200,
  },
  documentElement: {
    clientHeight: 1190,
    clientWidth: 785,
    offsetHeight: 1195,
    scrollHeight: 1200,
  },
} as Document;

const scaledIframeDocument = {
  body: {
    offsetHeight: 580,
    scrollHeight: 600,
  },
  documentElement: {
    clientHeight: 400,
    clientWidth: 800,
    offsetHeight: 580,
    scrollHeight: 600,
  },
} as Document;

vi.mock('../../../src/hooks', () => ({
  useAddonState: useAddonStateMock,
  useBrowserOptions: vi.fn(),
  useKeyPressFn: vi.fn(),
  usePreviewIframe: vi.fn(),
  useScreenshotOptions: vi.fn(),
}));

vi.mock('../../../src/utils', () => ({
  getIframeScrollPosition: vi.fn(),
  toast: {
    custom: toastCustomMock,
  },
}));

vi.mock('../../../src/components/common/IframeOverlay', () => ({
  IframeOverlay: React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => {
    if (typeof ref === 'function') {
      ref(overlayElement);
    } else if (ref) {
      ref.current = overlayElement;
    }

    return <div>{props.children}</div>;
  }),
}));

vi.mock('react-selecto', () => ({
  default: (props: SelectoMockProps) => {
    selectoProps.current = props;
    return <div className="selecto-mock" />;
  },
}));

describe('Clipper', () => {
  const defaultState = useClipperState.getState();
  let keyPressHandler: ((event: { code: string }) => void) | undefined;
  const setAddonStateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useClipperState.setState({ ...defaultState, clipping: true });
    keyPressHandler = undefined;

    (useAddonStateMock as Mock).mockImplementation(() => ({
      addonState: {
        clippingWarningDismissed: false,
      },
      setAddonState: setAddonStateMock,
    }));

    (useKeyPressFn as Mock).mockImplementation((_key, callback) => {
      keyPressHandler = callback;
      return undefined;
    });
    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: {} },
      setBrowserOptions: vi.fn(),
    }));
    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: {},
      setScreenshotOptions: vi.fn(),
    }));
    (usePreviewIframe as Mock).mockImplementation(() => undefined);
    (getIframeScrollPosition as Mock).mockImplementation(() => ({
      scrollLeft: 20,
      scrollTop: 30,
    }));
  });

  afterEach(() => {
    useClipperState.setState(defaultState);
  });

  it('should return null when clipping is disabled', () => {
    useClipperState.setState({ ...defaultState, clipping: false });

    const wrapper = shallow(<Clipper />);

    expect(wrapper.type()).toBe(null);
  });

  it('should sync viewport to preview iframe and set clip options on select end', () => {
    const setScreenshotOptions = vi.fn();
    const setBrowserOptions = vi.fn();

    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: { fullPage: false },
      setScreenshotOptions,
    }));

    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions,
    }));

    (usePreviewIframe as Mock).mockImplementation(
      () =>
        ({
          contentDocument: innerIframeDocument,
          getBoundingClientRect: () => ({
            bottom: 401.6,
            height: 401.6,
            left: 0,
            right: 800.3,
            toJSON: () => undefined,
            top: 0,
            width: 800.3,
            x: 0,
            y: 0,
          }),
        } as HTMLIFrameElement),
    );

    const wrapper = mount(<Clipper />);

    const onSelectEnd = selectoProps.current?.onSelectEnd;

    expect(onSelectEnd).toBeDefined();

    act(() => {
      onSelectEnd?.({
        rect: {
          bottom: 0,
          height: 120.1,
          left: 5,
          right: 0,
          toJSON: () => undefined,
          top: 10,
          width: 100.2,
          x: 5,
          y: 10,
        } as DOMRect,
      });
    });

    expect(setBrowserOptions).toHaveBeenCalledWith('all', {
      cursor: true,
      viewport: {
        height: 1200,
        width: 800,
      },
    });

    expect(setScreenshotOptions).toHaveBeenCalledWith({
      clip: {
        height: 121,
        width: 103,
        x: 25,
        y: 40,
      },
      fullPage: false,
    });

    expect(toastCustomMock).toHaveBeenCalledTimes(1);
    expect(toastCustomMock.mock.calls[0][0]).toEqual(expect.any(Function));

    const toastRender = toastCustomMock.mock.calls[0][0] as ({
      dismiss,
    }: {
      dismiss: () => void;
    }) => React.ReactElement;
    const toastWrapper = mount(toastRender({ dismiss: vi.fn() }));

    expect(toastWrapper.text()).toContain(
      'Clipping may differ from the Storybook preview',
    );

    toastWrapper.unmount();

    expect(useClipperState.getState().clipping).toBe(false);

    wrapper.unmount();
  });

  it('should normalize clip coordinates when preview iframe is visually scaled', () => {
    const setScreenshotOptions = vi.fn();
    const setBrowserOptions = vi.fn();

    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: { fullPage: false },
      setScreenshotOptions,
    }));

    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions,
    }));

    (usePreviewIframe as Mock).mockImplementation(
      () =>
        ({
          contentDocument: scaledIframeDocument,
          contentWindow: {
            document: scaledIframeDocument,
            innerHeight: 600,
            innerWidth: 1000,
          },
          getBoundingClientRect: () => ({
            bottom: 400,
            height: 400,
            left: 0,
            right: 800,
            toJSON: () => undefined,
            top: 0,
            width: 800,
            x: 0,
            y: 0,
          }),
        } as unknown as HTMLIFrameElement),
    );

    const wrapper = mount(<Clipper />);

    act(() => {
      selectoProps.current?.onSelectEnd?.({
        rect: {
          bottom: 140,
          height: 100,
          left: 80,
          right: 280,
          toJSON: () => undefined,
          top: 40,
          width: 200,
          x: 80,
          y: 40,
        } as DOMRect,
      });
    });

    expect(setBrowserOptions).toHaveBeenCalledWith('all', {
      cursor: true,
      viewport: {
        height: 600,
        width: 1000,
      },
    });

    expect(setScreenshotOptions).toHaveBeenCalledWith({
      clip: {
        height: 150,
        width: 250,
        x: 120,
        y: 90,
      },
      fullPage: false,
    });

    wrapper.unmount();
  });

  it('should persist the warning dismissal when the button is clicked', () => {
    const setScreenshotOptions = vi.fn();
    const setBrowserOptions = vi.fn();
    const dismiss = vi.fn();

    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: { fullPage: false },
      setScreenshotOptions,
    }));

    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions,
    }));

    (usePreviewIframe as Mock).mockImplementation(
      () =>
        ({
          contentDocument: innerIframeDocument,
          getBoundingClientRect: () => ({
            bottom: 401.6,
            height: 401.6,
            left: 0,
            right: 800.3,
            toJSON: () => undefined,
            top: 0,
            width: 800.3,
            x: 0,
            y: 0,
          }),
        } as HTMLIFrameElement),
    );

    const wrapper = mount(<Clipper />);

    act(() => {
      selectoProps.current?.onSelectEnd?.({
        rect: {
          bottom: 0,
          height: 120.1,
          left: 5,
          right: 0,
          toJSON: () => undefined,
          top: 10,
          width: 100.2,
          x: 5,
          y: 10,
        } as DOMRect,
      });
    });

    const toastRender = toastCustomMock.mock.calls[0][0] as ({
      dismiss,
    }: {
      dismiss: () => void;
    }) => React.ReactElement;
    const toastWrapper = mount(toastRender({ dismiss }));
    const hideButton = toastWrapper
      .find('button')
      .filterWhere((node) => node.text() === 'Do Not Show Again');

    expect(hideButton.exists()).toBe(true);

    act(() => {
      hideButton.prop('onClick')?.({} as React.MouseEvent<HTMLButtonElement>);
    });

    expect(setAddonStateMock).toHaveBeenCalledWith({
      clippingWarningDismissed: true,
    });
    expect(dismiss).toHaveBeenCalledTimes(1);

    toastWrapper.unmount();
    wrapper.unmount();
  });

  it('should not show the warning again after dismissal', () => {
    (useAddonStateMock as Mock).mockImplementation(() => ({
      addonState: {
        clippingWarningDismissed: true,
      },
      setAddonState: setAddonStateMock,
    }));

    const setScreenshotOptions = vi.fn();
    const setBrowserOptions = vi.fn();

    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: { fullPage: false },
      setScreenshotOptions,
    }));

    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions,
    }));

    (usePreviewIframe as Mock).mockImplementation(
      () =>
        ({
          contentDocument: innerIframeDocument,
          getBoundingClientRect: () => ({
            bottom: 401.6,
            height: 401.6,
            left: 0,
            right: 800.3,
            toJSON: () => undefined,
            top: 0,
            width: 800.3,
            x: 0,
            y: 0,
          }),
        } as HTMLIFrameElement),
    );

    const wrapper = mount(<Clipper />);

    act(() => {
      selectoProps.current?.onSelectEnd?.({
        rect: {
          bottom: 0,
          height: 120.1,
          left: 5,
          right: 0,
          toJSON: () => undefined,
          top: 10,
          width: 100.2,
          x: 5,
          y: 10,
        } as DOMRect,
      });
    });

    expect(toastCustomMock).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should stop clipping when Escape is pressed', () => {
    const wrapper = mount(<Clipper />);

    expect(keyPressHandler).toBeDefined();

    act(() => {
      keyPressHandler?.({ code: 'Enter' });
    });

    expect(useClipperState.getState().clipping).toBe(true);

    act(() => {
      keyPressHandler?.({ code: 'Escape' });
    });

    expect(useClipperState.getState().clipping).toBe(false);

    wrapper.unmount();
  });

  it('should ignore select end when preview iframe is unavailable', () => {
    const setScreenshotOptions = vi.fn();
    const setBrowserOptions = vi.fn();

    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: { fullPage: false },
      setScreenshotOptions,
    }));

    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions,
    }));

    (usePreviewIframe as Mock).mockImplementation(() => undefined);

    const wrapper = mount(<Clipper />);

    act(() => {
      selectoProps.current?.onSelectEnd?.({
        rect: {
          bottom: 0,
          height: 120.1,
          left: 5,
          right: 0,
          toJSON: () => undefined,
          top: 10,
          width: 100.2,
          x: 5,
          y: 10,
        } as DOMRect,
      });
    });

    expect(setBrowserOptions).not.toHaveBeenCalled();
    expect(setScreenshotOptions).not.toHaveBeenCalled();
    expect(toastCustomMock).not.toHaveBeenCalled();
    expect(useClipperState.getState().clipping).toBe(true);

    wrapper.unmount();
  });

  it('should stop clipping without updating options when the selection misses the iframe', () => {
    const setScreenshotOptions = vi.fn();
    const setBrowserOptions = vi.fn();

    (useScreenshotOptions as Mock).mockImplementation(() => ({
      screenshotOptions: { fullPage: false },
      setScreenshotOptions,
    }));

    (useBrowserOptions as Mock).mockImplementation(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions,
    }));

    (usePreviewIframe as Mock).mockImplementation(
      () =>
        ({
          contentDocument: innerIframeDocument,
          getBoundingClientRect: () => ({
            bottom: 401.6,
            height: 401.6,
            left: 0,
            right: 800.3,
            toJSON: () => undefined,
            top: 0,
            width: 800.3,
            x: 0,
            y: 0,
          }),
        } as HTMLIFrameElement),
    );

    const wrapper = mount(<Clipper />);

    act(() => {
      selectoProps.current?.onSelectEnd?.({
        rect: {
          bottom: 1200,
          height: 100,
          left: 900,
          right: 1000,
          toJSON: () => undefined,
          top: 1100,
          width: 100,
          x: 900,
          y: 1100,
        } as DOMRect,
      });
    });

    expect(setBrowserOptions).not.toHaveBeenCalled();
    expect(setScreenshotOptions).not.toHaveBeenCalled();
    expect(toastCustomMock).not.toHaveBeenCalled();
    expect(useClipperState.getState().clipping).toBe(false);

    wrapper.unmount();
  });
});
