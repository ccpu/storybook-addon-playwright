import React, { useCallback, useState } from 'react';
import { ScreenshotTestTargetType } from '../../../../typings';
import { useScreenshotUpdate } from '../../hooks/use-screenshot-update';
import { useImageDiffScreenshots } from '../../hooks/use-imagediff-screenshots';
import { Loader } from '../../../../components/common';
import { ScreenshotListPreviewDialog } from './ScreenshotListPreviewDialog';
import { Button } from '@material-ui/core';
import {
  setPauseDeleteImageDiffResult,
  removePassedImageDiffResult,
} from '../../store/actions';
import { useScreenshotStoreState } from '../../store/selectors';
import { toast } from '../../../../utils/toast';

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

  const state = useScreenshotStoreState();

  const { updateScreenshot } = useScreenshotUpdate();

  const handleSave = useCallback(async () => {
    setUpdateInProgress(true);
    try {
      const promises = state.screenshots.reduce<Array<Promise<void>>>(
        (arr, s) => {
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
        },
        [],
      );

      await Promise.all(promises);
      toast.success('Successfully updated.', {
        autoClose: false,
        toastId: 'story-screenshot-preview:updated',
      });
    } catch (error) {
      toast.error((error as { message: string }).message);
    }
    setUpdateInProgress(false);
  }, [state, updateScreenshot]);

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
            updating
              ? 'Following screenshots will be saved, would you like to continue?'
              : undefined
          }
          screenshots={state.screenshots}
          onClose={onClose}
          open={true}
          storyData={
            storyData || { filePath: '', id: '', name: '', parent: '' }
          }
          draggable={target === 'story' && !updateInProgress}
          footerActions={
            updating
              ? () => (
                  <>
                    <Button onClick={onClose} color="primary">
                      No
                    </Button>
                    <Button onClick={handleSave} color="primary" autoFocus>
                      Yes
                    </Button>
                  </>
                )
              : undefined
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
