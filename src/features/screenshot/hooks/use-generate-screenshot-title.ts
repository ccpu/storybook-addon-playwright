import type { BrowserTypes } from '../../../typings';
import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useKnobs } from '../../../hooks/use-knobs';
import { toast } from '../../../utils/toast';

export function useGenerateScreenshotTitle(browserType: BrowserTypes | 'storybook') {
  const storyData = useCurrentStoryData();
  const args = useKnobs();

  const { mutateAsync, isPending: isGenerating } =
    trpcClient.screenshot.generateScreenshotTitle.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Failed to generate screenshot title');
      },
    });

  const generateTitle = useCallback(async (): Promise<string | undefined> => {
    if (!storyData || browserType === 'storybook') return undefined;
    try {
      return await mutateAsync({
        args,
        browserType,
        filePath: storyData.filePath,
        props: args,
        storyId: storyData.id,
      });
    } catch {
      return undefined;
    }
  }, [args, browserType, mutateAsync, storyData]);

  return { generateTitle, isGenerating };
}
