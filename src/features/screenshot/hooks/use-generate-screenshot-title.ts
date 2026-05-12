import type { BrowserTypes } from '../../../typings';
import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useKnobs } from '../../../hooks/use-knobs';
import { toast } from '../../../utils/toast';
import { API, useStorybookApi, StoryEntry } from '@storybook/manager-api';
import { useBrowserOptions } from '../../../hooks';
import { useScreenshotOptionsValue } from '../../../store';

export function useGenerateScreenshotTitle(
  browserType: BrowserTypes | 'storybook' | null,
) {
  const storyData = useCurrentStoryData();
  const args = useKnobs();
  const api = useStorybookApi() as API;
  const { getBrowserOptions } = useBrowserOptions();
  const screenshotOptions = useScreenshotOptionsValue();
  const { data: hasGenerator = false } =
    trpcClient.screenshot.hasScreenshotTitleGenerator.useQuery();

  const browserOptions = getBrowserOptions(browserType as BrowserTypes);

  const { mutateAsync, isPending: isGenerating } =
    trpcClient.screenshot.generateScreenshotTitle.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Failed to generate screenshot title');
      },
    });

  const generateTitle = useCallback(async (): Promise<string | undefined> => {
    if (!storyData || browserType === 'storybook') return undefined;
    const currentStoryData = api.getCurrentStoryData() as StoryEntry & {
      parameters: {
        docs?: {
          description?: {
            story?: string;
          };
        };
      };
    };

    try {
      return await mutateAsync({
        browser: {
          type: browserType,
          options: browserOptions,
        },
        story: {
          changedArgs: args,
          filePath: storyData.filePath,
          id: storyData.id,
          initialArgs: currentStoryData.initialArgs,
          argTypes: currentStoryData.argTypes,
          parameters: currentStoryData.parameters as Record<string, unknown>,
          name: currentStoryData.name,
          title: currentStoryData.title,
        },
        screenshotOptions,
      });
    } catch {
      return undefined;
    }
  }, [api, args, browserOptions, browserType, mutateAsync, screenshotOptions, storyData]);

  return { generateTitle, hasGenerator, isGenerating };
}
