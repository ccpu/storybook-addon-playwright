// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('../../../../../src/api/trpc/client', async () => {
  const React = await import('react');
  const { testScreenshot, updateScreenshot } =
    await import('../../../../api/trpc/clients/__mocks__/screenshot.client');

  const useMutationFactory =
    (run: (input: unknown) => unknown) =>
    (options?: {
      onError?: (error: Error, input: unknown, context: unknown) => void;
      onSuccess?: (data: unknown, input: unknown, context: unknown) => void;
    }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
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
          useMutation: useMutationFactory((input) => testScreenshot(input as never)),
        },
        updateScreenshot: {
          useMutation: useMutationFactory((input) => updateScreenshot(input as never)),
        },
      },
    },
  };
});
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) => (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotUpdate } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotUpdate';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';

let currentStoryData: { filePath: string; id: string } | undefined;

vi.mock(
  '../../../../../src/features/screenshot/store/context',
  async () => await import('../../store/__mocks__/context'),
);
vi.mock(
  '../../../../../src/api/trpc/clients/screenshot.client',
  async () => await import('../../../../api/trpc/clients/__mocks__/screenshot.client'),
);
vi.mock('../../../../../src/hooks', async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useCurrentStoryData: vi.fn(() => currentStoryData),
  };
});

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
});
