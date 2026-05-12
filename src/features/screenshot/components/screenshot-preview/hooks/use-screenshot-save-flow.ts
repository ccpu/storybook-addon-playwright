import type { BrowserContextOptions, BrowserTypes } from '../../../../../typings';
import { useCallback, useRef, useState } from 'react';
import { inputModal } from '../../../../../components/common';
import { useGenerateScreenshotTitle } from '../../../hooks/use-generate-screenshot-title';
import { useSaveScreenshot } from '../../../hooks/use-save-screenshot';

interface ScreenshotSaveData {
  base64: string;
  browserOptions: BrowserContextOptions;
}

export const useScreenshotSaveFlow = (activeBrowsers: BrowserTypes[]) => {
  const [isQueueSaving, setIsQueueSaving] = useState(false);

  const screenshotDataRef = useRef<Record<string, ScreenshotSaveData>>({});

  const { generateTitle, hasGenerator } = useGenerateScreenshotTitle(null);
  const { getUpdatingScreenshotTitle, inProgress, saveScreenShot } = useSaveScreenshot();

  const setScreenshotData = useCallback(
    (browserType: BrowserTypes, data?: ScreenshotSaveData) => {
      if (!data) {
        delete screenshotDataRef.current[browserType];
        return;
      }

      screenshotDataRef.current[browserType] = data;
    },
    [],
  );

  const saveForBrowsers = useCallback(
    async (title: string, browsersToSave: BrowserTypes[]) => {
      setIsQueueSaving(true);
      try {
        for (const browserType of browsersToSave) {
          const screenshotData = screenshotDataRef.current[browserType];
          if (!screenshotData) continue;

          await saveScreenShot(
            browserType,
            title,
            screenshotData.base64,
            screenshotData.browserOptions,
          );
        }
      } finally {
        setIsQueueSaving(false);
      }
    },
    [saveScreenShot],
  );

  const openSaveDialog = useCallback(
    (browsersToSave: BrowserTypes[]) => {
      if (!browsersToSave.length) return;

      const dialogTitle =
        browsersToSave.length > 1 ? 'Screenshots Title' : 'Screenshot Title';

      void inputModal.show({
        onGenerateContent: hasGenerator ? generateTitle : undefined,
        onSave: (title) => {
          void saveForBrowsers(title, browsersToSave);
        },
        required: true,
        title: dialogTitle,
        value: getUpdatingScreenshotTitle(),
      });
    },
    [generateTitle, getUpdatingScreenshotTitle, hasGenerator, saveForBrowsers],
  );

  const requestSaveAll = useCallback(() => {
    openSaveDialog(activeBrowsers);
  }, [activeBrowsers, openSaveDialog]);

  const requestSaveOne = useCallback(
    (browserType: BrowserTypes) => {
      openSaveDialog([browserType]);
    },
    [openSaveDialog],
  );

  return {
    isSaving: isQueueSaving || inProgress,
    requestSaveAll,
    requestSaveOne,
    setScreenshotData,
  };
};
