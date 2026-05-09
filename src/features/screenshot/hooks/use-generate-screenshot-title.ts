import type { BrowserTypes } from '../../../typings';
import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useKnobs } from '../../../hooks/use-knobs';

import { toast } from '../../../utils/toast';
import { API, useStorybookApi, StoryEntry } from '@storybook/manager-api';

export function useGenerateScreenshotTitle(browserType: BrowserTypes | 'storybook') {
  const storyData = useCurrentStoryData();
  const args = useKnobs();
  const api = useStorybookApi() as API;

  const { mutateAsync, isPending: isGenerating } =
    trpcClient.screenshot.generateScreenshotTitle.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Failed to generate screenshot title');
      },
    });

  for (const key in api) {
    if (typeof api[key] === 'function') {
      const originalFn = api[key];

      try {
        if (key.startsWith('get')) {
          console.log(key, originalFn());
        }
      } catch {
        // Ignore errors from other hooks
      }
    }
  }

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
        changedArgs: args,
        browserType,
        filePath: storyData.filePath,
        initialArgs: currentStoryData.initialArgs,
        storyId: storyData.id,
        argTypes: currentStoryData.argTypes,
        parameters: currentStoryData.parameters as Record<string, unknown>,
        name: currentStoryData.name,
        title: currentStoryData.title,
      });
    } catch {
      return undefined;
    }
  }, [api, args, browserType, mutateAsync, storyData]);

  return { generateTitle, isGenerating };
}
