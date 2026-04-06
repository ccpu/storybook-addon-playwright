import React, { useCallback, useState } from 'react';
import { ScreenshotTestTargetType } from '../../../../typings';
import {
  useImageDiffScreenshots,
  useScreenshotUpdate,
  useSnackbar,
} from '../../../../hooks';
import { Loader } from '../../../../components/common';
import { ScreenshotListPreviewDialog } from './ScreenshotListPreviewDialog';
import { Button } from '@material-ui/core';
import {
  useScreenshotStoreState,
  setPauseDeleteImageDiffResult,
  removePassedImageDiffResult,
} from '../../store/index';

export interface StoryScreenshotPreviewProps {
  onClose: () => void;
  updating?: boolean;
  target: ScreenshotTestTargetType;
  onLoad?: () => void;
}

const StoryScreenshotPreview: React.FC<StoryScreenshotPreviewProps> = (
  props,
) => {
  const { onClose, updating, target, onLoad } = props;

  const { loading, storyData } = useImageDiffScreenshots(target, onLoad);

  const [updateInProgress, setUpdateInProgress] = useState(false);

  const { openSnackbar } = useSnackbar();

  const state = useScreenshotStoreState();

  const { updateScreenshot } = useScreenshotUpdate();

  const handleSave = useCallback(async () => {
    setUpdateInProgress(true);
    try {
      const promises = state.screenshots.reduce((arr, s) => {
        const imageDiffResult = state.imageDiffResults.find(
          (x) => x.screenshotId === s.id,
        );
        if (!imageDiffResult) {
          throw new Error(
            `Unable to find image diff result for '${s.title}' screenshot.`,
          );
        }
        arr.push(updateScreenshot(imageDiffResult));
        return arr;
      }, []);

      await Promise.all(promises);
      openSnackbar('Successfully updated.', {
        autoHideDuration: null,
        variant: 'success',
      });
    } catch (error) {
      openSnackbar((error as { message: string }).message, {
        variant: 'error',
      });
    }
    setUpdateInProgress(false);
  }, [openSnackbar, state, updateScreenshot]);

  React.useEffect(() => {
    setPauseDeleteImageDiffResult(true);

    return () => {
      setPauseDeleteImageDiffResult(false);
      removePassedImageDiffResult();
    };
  }, []);

  return (
    <>
      <Loader open={loading || updateInProgress} />
      {!loading && (
        <ScreenshotListPreviewDialog
          title={
            updating &&
            'Following screenshots will be saved, would you like to continue?'
          }
          screenshots={state.screenshots}
          onClose={onClose}
          open={true}
          storyData={storyData}
          draggable={target === 'story' && !updateInProgress}
          footerActions={
            updating &&
            (() => (
              <>
                <Button onClick={onClose} color="primary">
                  No
                </Button>
                <Button onClick={handleSave} color="primary" autoFocus>
                  Yes
                </Button>
              </>
            ))
          }
        >
          <Loader open={updateInProgress} />
        </ScreenshotListPreviewDialog>
      )}
    </>
  );
};

StoryScreenshotPreview.displayName = 'StoryScreenshotPreview';
const MemoizedStoryScreenshotPreview = React.memo(StoryScreenshotPreview);

export { StoryScreenshotPreview, MemoizedStoryScreenshotPreview };
