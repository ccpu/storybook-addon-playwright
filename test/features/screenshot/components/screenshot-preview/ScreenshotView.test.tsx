// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) => (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotView } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenshotView';
import { shallow } from 'enzyme';
import React from 'react';
import { ErrorPanel, Dialog } from '../../../../../src/components/common';
import { ScreenShotViewToolbar } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenShotViewToolbar';
import { useScreenshot } from '../../../../../src/features/screenshot/hooks/use-screenshot';

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot',
  async () => await import('../../hooks/__mocks__/use-screenshot'),
);
vi.mock(
  '../../../../../src/hooks/use-browser-options',
  async () => await import('../../../../hooks/__mocks__/use-browser-options'),
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-edit-screenshot',
  async () => await import('../../hooks/__mocks__/use-edit-screenshot'),
);

const useScreenshotMock = useScreenshot as Mock;

describe('ScreenshotView', () => {
  const useScreenshotMockData = () => ({
    getSnapshot: vi.fn(),
    loading: false,
    screenshot: {
      base64: 'base64-image',
      error: undefined,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
    }));
  });

  it('should render', () => {
    const wrapper = shallow(<ScreenshotView browserType="chromium" height={200} />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('img').type()).toBe('img');
  });

  it('should display error when unable to get screen shot', () => {
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
      screenshot: {
        error: 'foo',
      },
    }));

    const wrapper = shallow(<ScreenshotView browserType="chromium" height={200} />);
    const errorPanel = wrapper.find(ErrorPanel);
    expect(errorPanel).toHaveLength(1);
  });

  it('should render storybook story in iframe', () => {
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
      screenshot: undefined,
    }));
    const wrapper = shallow(<ScreenshotView browserType="storybook" height={200} />);

    expect(wrapper.find('iframe')).toHaveLength(1);
  });

  it('should handle refresh', () => {
    const onRefreshEndMock = vi.fn();
    const wrapper = shallow(
      <ScreenshotView
        browserType="storybook"
        height={200}
        refresh={true}
        onRefreshEnd={onRefreshEndMock}
      />,
    );
    wrapper.setProps({ refresh: false });
    expect(onRefreshEndMock).toHaveBeenCalledTimes(1);
  });

  it('should open/close image in full screen', () => {
    const wrapper = shallow(<ScreenshotView browserType="firefox" height={200} />);
    wrapper.find(ScreenShotViewToolbar).props().onFullScreen();
    expect(wrapper.find(Dialog).props().open).toBe(true);
  });

  it('should call onSave callback when saving', () => {
    const onSaveMock = vi.fn();
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} onSave={onSaveMock} />,
    );
    const toolbar = wrapper.find(ScreenShotViewToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onSave();

    expect(onSaveMock).toHaveBeenCalledWith('firefox');
  });

  it('should publish screenshot data to parent', () => {
    const onScreenshotDataChangeMock = vi.fn();
    const wrapper = shallow(
      <ScreenshotView
        browserType="chromium"
        height={200}
        onScreenshotDataChange={onScreenshotDataChangeMock}
      />,
    );

    expect(wrapper.exists()).toBe(true);
    expect(onScreenshotDataChangeMock).toHaveBeenCalledWith(
      'chromium',
      expect.objectContaining({
        base64: 'base64-image',
      }),
    );
  });
});
