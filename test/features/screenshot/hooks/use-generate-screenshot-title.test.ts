import { useGenerateScreenshotTitle } from '../../../../src/features/screenshot/hooks/use-generate-screenshot-title';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import mockConsole from 'jest-mock-console';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';
import { vi, Mock } from 'vitest';
import { useCurrentStoryData } from '../../../../src/hooks/use-current-story-data';
import { useKnobs } from '../../../../src/hooks/use-knobs';
import { useStorybookApi } from '@storybook/manager-api';
import { useBrowserOptions } from '../../../../src/hooks/use-browser-options';
import { useScreenshotOptionsValue } from '../../../../src/store/ui-selectors';

vi.mock('../../../../src/hooks/use-current-story-data', () => ({
  useCurrentStoryData: vi.fn(),
}));

vi.mock('../../../../src/hooks/use-knobs', () => ({
  useKnobs: vi.fn(),
}));

vi.mock('@storybook/manager-api', () => ({
  useStorybookApi: vi.fn(),
}));

vi.mock('../../../../src/hooks/use-browser-options', () => ({
  useBrowserOptions: vi.fn(),
}));

vi.mock('../../../../src/store/ui-selectors', () => ({
  useScreenshotOptionsValue: vi.fn(),
}));

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);

describe('useGenerateScreenshotTitle', () => {
  let restoreConsole: () => void;

  const mockStoryData = {
    filePath: 'src/story.tsx',
    id: 'story--name',
    name: 'Story',
    parent: 'component',
  };

  const mockArgs = {
    color: 'red',
  };

  const mockApi = {
    getCurrentStoryData: vi.fn(),
  };

  const mockBrowserOptions = {
    deviceName: 'desktop',
  };

  const mockScreenshotOptions = {
    fullPage: true,
  };

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentStoryData as Mock).mockReturnValue(mockStoryData);
    (useKnobs as Mock).mockReturnValue(mockArgs);
    (useStorybookApi as Mock).mockReturnValue(mockApi);
    (useBrowserOptions as Mock).mockReturnValue({
      getBrowserOptions: vi.fn(() => mockBrowserOptions),
    });
    (useScreenshotOptionsValue as Mock).mockReturnValue(mockScreenshotOptions);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined for storybook browserType', async () => {
    const { result } = renderHook(() => useGenerateScreenshotTitle('storybook'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBeUndefined();
  });

  it('should return undefined when storyData is undefined', async () => {
    (useCurrentStoryData as Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useGenerateScreenshotTitle('chromium'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBeUndefined();
  });

  it('should return generated title from server', async () => {
    const mockCurrentStoryData = {
      initialArgs: {},
      argTypes: {},
      parameters: { __id: 'story-id' },
      name: 'With Component',
      title: 'Component',
    };
    mockApi.getCurrentStoryData.mockReturnValue(mockCurrentStoryData);

    const spy = vi.fn();
    server.use(
      trpcMsw.screenshot.generateScreenshotTitle.mutation(({ input }) => {
        spy(input);
        return 'AI Generated Title';
      }),
    );

    const { result } = renderHook(() => useGenerateScreenshotTitle('chromium'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBe('AI Generated Title');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        browser: {
          type: 'chromium',
          options: mockBrowserOptions,
        },
        story: {
          changedArgs: mockArgs,
          filePath: mockStoryData.filePath,
          id: mockStoryData.id,
          initialArgs: mockCurrentStoryData.initialArgs,
          argTypes: mockCurrentStoryData.argTypes,
          parameters: mockCurrentStoryData.parameters,
          name: mockCurrentStoryData.name,
          title: mockCurrentStoryData.title,
        },
        screenshotOptions: mockScreenshotOptions,
      }),
    );
  });

  it('should return undefined on TRPC error', async () => {
    const mockCurrentStoryData = {
      initialArgs: {},
      argTypes: {},
      parameters: { __id: 'story-id' },
      name: 'With Component',
      title: 'Component',
    };
    mockApi.getCurrentStoryData.mockReturnValue(mockCurrentStoryData);

    server.use(
      trpcMsw.screenshot.generateScreenshotTitle.mutation(() => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Not configured' });
      }),
    );

    const { result } = renderHook(() => useGenerateScreenshotTitle('chromium'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBeUndefined();
  });

  it('should return undefined on other exceptions', async () => {
    const mockCurrentStoryData = {
      initialArgs: {},
      argTypes: {},
      parameters: { __id: 'story-id' },
      name: 'With Component',
      title: 'Component',
    };
    mockApi.getCurrentStoryData.mockReturnValue(mockCurrentStoryData);

    server.use(
      trpcMsw.screenshot.generateScreenshotTitle.mutation(() => {
        throw new Error('Network error');
      }),
    );

    const { result } = renderHook(() => useGenerateScreenshotTitle('chromium'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBeUndefined();
  });

  it('should work with firefox browserType', async () => {
    const mockCurrentStoryData = {
      initialArgs: {},
      argTypes: {},
      parameters: { __id: 'story-id' },
      name: 'With Component',
      title: 'Component',
    };
    mockApi.getCurrentStoryData.mockReturnValue(mockCurrentStoryData);

    const spy = vi.fn();
    server.use(
      trpcMsw.screenshot.generateScreenshotTitle.mutation(({ input }) => {
        spy(input);
        return 'Firefox Title';
      }),
    );

    const { result } = renderHook(() => useGenerateScreenshotTitle('firefox'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBe('Firefox Title');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        browser: {
          type: 'firefox',
          options: mockBrowserOptions,
        },
      }),
    );
  });

  it('should work with webkit browserType', async () => {
    const mockCurrentStoryData = {
      initialArgs: {},
      argTypes: {},
      parameters: { __id: 'story-id' },
      name: 'With Component',
      title: 'Component',
    };
    mockApi.getCurrentStoryData.mockReturnValue(mockCurrentStoryData);

    const spy = vi.fn();
    server.use(
      trpcMsw.screenshot.generateScreenshotTitle.mutation(({ input }) => {
        spy(input);
        return 'Webkit Title';
      }),
    );

    const { result } = renderHook(() => useGenerateScreenshotTitle('webkit'));

    let title: string | undefined;
    await act(async () => {
      title = await result.current.generateTitle();
    });

    expect(title).toBe('Webkit Title');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        browser: {
          type: 'webkit',
          options: mockBrowserOptions,
        },
      }),
    );
  });

  it('should expose isGenerating state transitions', async () => {
    const mockCurrentStoryData = {
      initialArgs: {},
      argTypes: {},
      parameters: { __id: 'story-id' },
      name: 'With Component',
      title: 'Component',
    };
    mockApi.getCurrentStoryData.mockReturnValue(mockCurrentStoryData);

    let resolveMutation!: (value: string) => void;
    const mutationPromise = new Promise<string>((resolve) => {
      resolveMutation = resolve;
    });

    server.use(
      trpcMsw.screenshot.generateScreenshotTitle.mutation(() => mutationPromise),
    );

    const { result } = renderHook(() => useGenerateScreenshotTitle('chromium'));

    expect(result.current.isGenerating).toBe(false);

    let titlePromise!: Promise<string | undefined>;
    act(() => {
      titlePromise = result.current.generateTitle();
    });

    // Wait for isGenerating to become true
    await waitFor(() => {
      expect(result.current.isGenerating).toBe(true);
    });

    // Resolve the mutation
    resolveMutation('Generated Title');

    await titlePromise;

    // Wait for isGenerating to become false
    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });
  });
});
