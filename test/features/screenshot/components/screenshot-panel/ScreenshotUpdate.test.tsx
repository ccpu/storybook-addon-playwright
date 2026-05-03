// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('../../../../../src/api/trpc/client', async () => {
  const React = await import('react');
  const { testScreenshot, updateScreenshot } = await import(
    '../../../../api/trpc/clients/__mocks__/screenshot.client'
  );

  const useMutationFactory =
    (run: (input: unknown) => unknown) =>
    (options?: {
      onError?: (error: Error, input: unknown, context: unknown) => void;
      onSuccess?: (data: unknown, input: unknown, context: unknown) => void;
    }) => {
      const [data, setData] = React.useState<unknown>(undefined);

      const mutateAsync = async (input: unknown) => {
        try {
          const result = await Promise.resolve(run(input));
          setData(result);
          options?.onSuccess?.(result, input, undefined);
          return result;
        } catch (error) {
          options?.onError?.(error as Error, input, undefined);
          throw error;
        }
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
    };

  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      screenshot: {
        testScreenshot: {
          useMutation: useMutationFactory((input) =>
            testScreenshot(input as never),
          ),
        },
        updateScreenshot: {
          useMutation: useMutationFactory((input) =>
            updateScreenshot(input as never),
          ),
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
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotUpdate } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotUpdate';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';
import { IconButton } from '@material-ui/core';
import {
  testScreenshot,
  updateScreenshot,
} from '../../../../../src/api/trpc/clients/screenshot.client';
import { ImageDiffPreviewDialog } from '../../../../../src/components/common';

let currentStoryData: { filePath: string; id: string } | undefined;

vi.mock(
  '../../../../../src/features/screenshot/store/context',
  async () => await import('../../store/__mocks__/context'),
);
vi.mock(
  '../../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../../api/trpc/clients/__mocks__/screenshot.client'),
);
vi.mock('../../../../../src/hooks', async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useCurrentStoryData: vi.fn(() => currentStoryData),
  };
});

const testScreenshotMock = vi.mocked(testScreenshot);
const updateScreenshotMock = vi.mocked(updateScreenshot);

describe('ScreenshotUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentStoryData = {
      filePath: './test.stories.tsx',
      id: 'story-id',
    };
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render', () => {
    const onStateChangeMock = vi.fn();
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={onStateChangeMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(onStateChangeMock).toHaveBeenCalledTimes(1);
  });

  it('should fetch image diff and show ImageDiffPreviewDialog if imageDiffResult prop not provided and save', async () => {
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={vi.fn()}
      />,
    );
    const button = wrapper.find(IconButton).first();
    button
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    expect(imageDiffPreviewDialog).toHaveLength(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(imageDiffPreviewDialog.props().titleActions()).toBeDefined();

    expect(testScreenshotMock).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(updateScreenshotMock).toHaveBeenCalledTimes(0);

    const footerButtons = imageDiffPreviewDialog
      .props()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .footerActions().props.children as { props: { onClick: () => void } }[];

    await footerButtons[1].props.onClick();

    expect(footerButtons).toHaveLength(2);

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      base64: 'base64-image',
      filePath: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });

  it('should call for update directly if imageDiffResult prop provided', async () => {
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={vi.fn()}
        imageDiffResult={{
          filePath: './test.stories.tsx',
          newScreenshot: 'base64-image',
          pass: true,
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        }}
      />,
    );
    const iconButton = wrapper.find(IconButton).first();

    await iconButton
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    await new Promise((resolve) => setImmediate(resolve));

    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(0);

    expect(testScreenshotMock).toHaveBeenCalledTimes(0);

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      base64: 'base64-image',
      filePath: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });
});
