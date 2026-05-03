// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('../../../../../src/api/trpc/client', async () => {
  const React = await import('react');
  const { testScreenshot } = await import(
    '../../../../api/trpc/clients/__mocks__/screenshot.client'
  );

  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      screenshot: {
        testScreenshot: {
          useMutation: () => {
            const [data, setData] = React.useState<unknown>(undefined);
            const mutateAsync = async (input: unknown) => {
              const result = await testScreenshot(input as never);
              setData(result);
              return result;
            };

            return {
              data,
              isPending: false,
              mutate: (input: unknown) => {
                void mutateAsync(input);
              },
              mutateAsync,
              reset: () => setData(undefined),
            };
          },
        },
      },
    },
  };
});
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
// Changed: useTanstackMutation internally calls hooks that can conflict with
// useEffect spy active, this second effect collides with the component's own
// useEffect in the depsTracker (premature callIndex reset overwrites idx 0),
// causing an infinite re-render loop and OOM crash. Mocking the hook prevents
// the inner useEffect while preserving all test assertions: makeCall still
// invokes testScreenshot, and result is pre-filled so ImageDiffPreviewDialog
// renders immediately.
vi.mock('../../../../../src/hooks/use-tanstack-mutation', () => ({
  useTanstackMutation: (func: (...args: unknown[]) => unknown) => {
    const mockResult = {
      fileName: './test.stories.tsx',
      newScreenshot: 'base64-image',
      pass: true,
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    };
    return {
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
import '../../../../manual-mocks/react-useEffect';
import { storyData } from '../../../../configs/story-data';
import { ScreenshotPreviewDialog } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotPreviewDialog';
import { shallow } from 'enzyme';
import { ScreenshotData } from '../../../../../src/typings';
import { StoryData } from '../../../../../src/schema';
import React from 'react';
import { ImageDiffPreviewDialog } from '../../../../../src/components/common';
import { testScreenshot } from '../../../../../src/api/trpc/clients/screenshot.client';
import { act } from '@testing-library/react-hooks';

vi.mock(
  '../../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../../api/trpc/clients/__mocks__/screenshot.client'),
);

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
