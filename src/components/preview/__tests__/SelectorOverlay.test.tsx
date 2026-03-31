// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
// This vi.mock also overrides useRef to return the iframe-setup-compatible ref
// that was previously in a separate vi.mock('react', ...) call (merged here).
// Changed: events must be declared via vi.hoisted() so it is available when the
// vi.mock factory (also hoisted) captures it via closure before module body runs.
const events = vi.hoisted(() => ({} as Record<string, (e?: any) => void>));
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = {
    ...(actual.default ?? actual),
    useEffect: hook,
    useRef: () => ({
      current: {
        addEventListener: (name: string, callback: () => void) => {
          events[name] = callback;
        },
        contains: (elm: HTMLElement) => elm.className !== 'out',
        querySelector: () => createElement('div'),
      },
    }),
  };
  return {
    ...actual,
    default: patchedDefault,
    useEffect: hook,
    useRef: patchedDefault.useRef,
  };
});
import { useEffectCleanup } from '../../../../__manual_mocks__/react-useEffect';
import { SelectorOverlay } from '../SelectorOverlay';
import { shallow } from 'enzyme';
import React, { createElement } from 'react';
import useKey from 'react-use/lib/useKey';
import { useSelectorManager } from '../../../hooks/use-selector-manager';
import useThrottleFn from 'react-use/lib/useThrottleFn';

vi.mock('../../../hooks/use-key-press');
vi.mock('../../../hooks/use-selector-manager');

const stopSelectorMock = vi.fn();
const setSelectorDataMock = vi.fn();

const useSelectorManagerMockData = (
  selectorType: 'selector' | 'position' = 'selector',
) => ({
  selectorManager: { type: selectorType },
  setSelectorData: setSelectorDataMock,
  startSelector: vi.fn(),
  stopSelector: stopSelectorMock,
});

const getIframe = (elementFromPointEl?: HTMLElement) => {
  return {
    contentWindow: {
      document: {
        elementFromPoint: (x: number) =>
          x === -1 ? undefined : elementFromPointEl,
      },
    },
  } as unknown as HTMLIFrameElement;
};

describe('SelectorOverlay', () => {
  let useThrottleFnCallback;

  let eventListenerCallback: (e: Partial<MouseEvent>) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    document.body.addEventListener = vi
      .fn()
      .mockImplementation((_name: string, cb: () => void) => {
        eventListenerCallback = cb;
      });

    (useSelectorManager as Mock).mockImplementation(() =>
      useSelectorManagerMockData(),
    );

    (useThrottleFn as Mock).mockImplementation((cb: () => void) => {
      useThrottleFnCallback = cb;
    });
  });

  it('should render', () => {
    const wrapper = shallow(<SelectorOverlay />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should call to stop selector mode on "Escape" key press', () => {
    let callback: { (): void; (): void };
    (useKey as Mock).mockImplementation((_key: string, cb: () => void) => {
      callback = cb;
    });
    shallow(<SelectorOverlay />);
    expect(useKey).toHaveBeenCalled();
    callback();
    expect(stopSelectorMock).toHaveBeenCalledTimes(1);
  });

  it('should set height and width on preview element to 100% when mouse in over html tag', () => {
    const elm = document.createElement('html');

    const wrapper = shallow(<SelectorOverlay iframe={getIframe(elm)} />);

    useThrottleFnCallback(10, 10);

    expect(wrapper.find('.selector-preview').props().style.height).toBe('100%');
    expect(wrapper.find('.selector-preview').props().style.width).toBe('100%');
  });

  it('should set style of target element to preview', () => {
    const elm = document.createElement('div');

    elm.getBoundingClientRect = () => {
      return {
        bottom: 100,
        height: 20,
        left: 100,
        right: 100,
        toJSON: () => undefined,
        top: 100,
        width: 20,
        x: 100,
        y: 100,
      };
    };
    elm.style.height = '20px';
    elm.style.width = '20px';

    const wrapper = shallow(<SelectorOverlay iframe={getIframe(elm)} />);

    useThrottleFnCallback(10, 10);

    expect(wrapper.find('.selector-preview').props().style.height).toBe(20);
    expect(wrapper.find('.selector-preview').props().style.width).toBe(20);
    expect(wrapper.find('.selector-preview').props().style.top).toBe(100);
    expect(wrapper.find('.selector-preview').props().style.left).toBe(100);
  });

  it('should start position selector and show info', () => {
    const elm = document.createElement('div');

    (useSelectorManager as Mock).mockImplementation(() =>
      useSelectorManagerMockData('position'),
    );

    const wrapper = shallow(<SelectorOverlay iframe={getIframe(elm)} />);

    expect(useThrottleFn).toHaveBeenCalled();
    useThrottleFnCallback(10, 10);

    expect(wrapper.find('div').first().text()).toBe('X: 10Y: 10div');
  });

  it('should start path selector and show info', () => {
    const elm = document.createElement('div');

    const wrapper = shallow(<SelectorOverlay iframe={getIframe(elm)} />);

    useThrottleFnCallback(10, 10);

    expect(wrapper.find('div').first().text()).toBe('X: 10Y: 10div');
  });

  it('should set selector data on mouse up', () => {
    const elm = document.createElement('div');

    shallow(<SelectorOverlay iframe={getIframe(elm)} />);

    useThrottleFnCallback(10, 10);

    eventListenerCallback({ target: elm });
    expect(setSelectorDataMock).toHaveBeenCalledWith({
      path: 'div',
      x: 10,
      y: 10,
    });
  });

  it('should not have path when mouse position is out of preview boundary', () => {
    const elm = document.createElement('div');
    elm.className = 'out';

    shallow(<SelectorOverlay iframe={getIframe(elm)} />);

    expect(useThrottleFn).toHaveBeenCalled();
    useThrottleFnCallback(10, 10);

    eventListenerCallback({ target: elm });

    expect(setSelectorDataMock).toHaveBeenCalledWith({
      path: undefined,
      x: 10,
      y: 10,
    });
  });

  it('should not have path if elementFromPoint return nothing', () => {
    const elm = document.createElement('div');
    shallow(<SelectorOverlay iframe={getIframe()} />);

    expect(useThrottleFn).toHaveBeenCalled();
    useThrottleFnCallback(10, 10);

    eventListenerCallback({ target: elm });
    expect(setSelectorDataMock).toHaveBeenCalledWith({
      path: undefined,
      x: 10,
      y: 10,
    });
  });

  it('should remove style', () => {
    const spyOnRemoveChild = vi.spyOn(document.head, 'removeChild');
    shallow(<SelectorOverlay iframe={getIframe()} />);
    useEffectCleanup();
    expect(spyOnRemoveChild).toHaveBeenCalledTimes(1);
  });
});
