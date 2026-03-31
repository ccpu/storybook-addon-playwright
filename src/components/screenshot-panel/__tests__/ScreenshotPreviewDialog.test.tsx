// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
// Changed: useAsyncApiCall internally calls useEffect for cleanup. With the
// useEffect spy active, this second effect collides with the component's own
// useEffect in the depsTracker (premature callIndex reset overwrites idx 0),
// causing an infinite re-render loop and OOM crash. Mocking the hook prevents
// the inner useEffect while preserving all test assertions: makeCall still
// invokes testScreenshot, and result is pre-filled so ImageDiffPreviewDialog
// renders immediately.
vi.mock('../../../hooks/use-async-api-call', () => ({
  useAsyncApiCall: (func: (...args: unknown[]) => unknown) => {
    const mockResult = {
      fileName: './test.stories.tsx',
      newScreenshot: 'base64-image',
      pass: true,
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    };
    return {
      ErrorSnackbar: () => null,
      clearResult: () => undefined,
      inProgress: false,
      makeCall: (...args: unknown[]) => {
        func(...args);
        return Promise.resolve(mockResult);
      },
      result: mockResult,
    };
  },
}));
import '../../../../__manual_mocks__/react-useEffect';
import { storyData } from '../../../../__test_data__/story-data';
import { ScreenshotPreviewDialog } from '../ScreenshotPreviewDialog';
import { shallow } from 'enzyme';
import { ScreenshotData, StoryData } from '../../../typings';
import React from 'react';
import { ImageDiffPreviewDialog } from '../../common';
import { testScreenshot } from '../../../features/screenshot/screenshot.client';
import { act } from '@testing-library/react-hooks';

vi.mock('../../../features/screenshot/screenshot.client');

describe('ScreenshotPreviewDialog', () => {
  const getScreenshotDate = (): ScreenshotData => {
    return {
      browserType: 'chromium',
      id: 'screenshot-id',
      title: 'title',
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render result', async () => {
    const wrapper = shallow(
      <ScreenshotPreviewDialog
        storyData={storyData as StoryData}
        open={true}
        screenShotData={getScreenshotDate()}
      />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    expect(testScreenshot).toHaveBeenCalledTimes(1);

    expect(imageDiffPreviewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(imageDiffPreviewDialog.props().titleActions()).toBeDefined();
  });

  it('should show handle close', async () => {
    const onCLoseMock = vi.fn();

    const wrapper = shallow(
      <ScreenshotPreviewDialog
        storyData={storyData as StoryData}
        open={true}
        screenShotData={getScreenshotDate()}
        onClose={onCLoseMock}
      />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    act(() => {
      imageDiffPreviewDialog.props().onClose();
    });

    expect(onCLoseMock).toHaveBeenCalledTimes(1);
  });
});
