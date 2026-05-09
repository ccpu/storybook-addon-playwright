import { useGenerateScreenshotTitle } from '../../../../src/features/screenshot/hooks/use-generate-screenshot-title';
import { renderHook, act } from '@testing-library/react-hooks';
import mockConsole from 'jest-mock-console';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock('../../../../src/hooks/use-current-story-data', () => ({
  useCurrentStoryData: () => ({
    filePath: 'src/story.tsx',
    id: 'story--name',
    name: 'Story',
    parent: 'component',
  }),
}));

vi.mock('../../../../src/hooks/use-knobs', () => ({
  useKnobs: () => ({
    color: 'red',
  }),
}));

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);

describe('useGenerateScreenshotTitle', () => {
  let restoreConsole: () => void;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
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

  it('should return generated title from server', async () => {
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
        browserType: 'chromium',
        changedArgs: { color: 'red' },
        filePath: 'src/story.tsx',
        name: 'With Component',
        parameters: expect.objectContaining({
          __id: 'story-id',
        }),
        storyId: 'story--name',
      }),
    );
  });

  it('should return undefined on error', async () => {
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

  it('should expose isGenerating state', () => {
    const { result } = renderHook(() => useGenerateScreenshotTitle('chromium'));
    expect(result.current.isGenerating).toBe(false);
  });
});
