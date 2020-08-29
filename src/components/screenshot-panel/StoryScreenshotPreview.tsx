import React, { SFC, useCallback, useState } from 'react';
import { ScreenshotTestTargetType } from '../../typings';
import { useStoryScreenshotsDiff, useScreenshotUpdate } from '../../hooks';
import { Loader, Snackbar } from '../common';
import { ScreenshotListPreviewDialog } from './ScreenshotListPreviewDialog';
import { Button } from '@material-ui/core';
import {
  useScreenshotContext,
  useScreenshotDispatch,
} from '../../store/screenshot';

export interface StoryScreenshotPreviewProps {
  onClose: () => void;
  updating?: boolean;
  target: ScreenshotTestTargetType;
  onLoad?: () => void;
}

const StoryScreenshotPreview: SFC<StoryScreenshotPreviewProps> = (props) => {
  const { onClose, updating, target, onLoad } = props;

  const { loading, storyData, loaded } = useStoryScreenshotsDiff(target);

  const dispatch = useScreenshotDispatch();

  const [updateInProgress, setUpdateInProgress] = useState(false);

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);

  const state = useScreenshotContext();

  const { updateScreenshot } = useScreenshotUpdate();

  const handleSave = useCallback(async () => {
    setUpdateInProgress(true);
    try {
      const promises = state.screenshots.map((s) => {
        const imageDiffResult = state.imageDiffResults.find(
          (x) => x.screenshotId === s.id,
        );
        if (!imageDiffResult) {
          throw new Error(
            `Unable to find image diff result for '${s.title}' screenshot.`,
          );
        }
        updateScreenshot(imageDiffResult);
      });

      await Promise.all(promises);
      setSuccess(true);
      setOpenDialog(false);
    } catch (error) {
      setError(error.message);
    }
    setUpdateInProgress(false);
  }, [state.imageDiffResults, state.screenshots, updateScreenshot]);

  const handleErrorClose = useCallback(() => {
    setError(undefined);
  }, []);

  React.useEffect(() => {
    if (openDialog) {
      dispatch({
        state: true,
        type: 'pauseDeleteImageDiffResult',
      });
    }
  }, [dispatch, openDialog]);

  const handleClose = React.useCallback(() => {
    dispatch({
      type: 'removePassedImageDiffResult',
    });
    onClose();
  }, [dispatch, onClose]);

  React.useEffect(() => {
    if (loaded && onLoad) onLoad();
  }, [loaded, onLoad]);

  return (
    <>
      <Loader open={loading} />
      {!loading && (
        <ScreenshotListPreviewDialog
          title={
            updating &&
            'Following screenshots will be saved, would you like to continue?'
          }
          screenshots={state.screenshots}
          onClose={handleClose}
          open={openDialog}
          storyData={storyData}
          draggable={target === 'story'}
          footerActions={
            updating &&
            (() => (
              <>
                <Button onClick={handleClose} color="primary">
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
      <Snackbar
        variant="success"
        message="Story screenshots updates successfully."
        open={success}
        onClose={handleClose}
        autoHideDuration={4000}
      />

      <Snackbar
        variant="error"
        title="Error"
        message={error}
        open={Boolean(error)}
        onClose={handleErrorClose}
      />
    </>
  );
};

StoryScreenshotPreview.displayName = 'StoryScreenshotPreview';
const MemoizedStoryScreenshotPreview = React.memo(StoryScreenshotPreview);

export { StoryScreenshotPreview, MemoizedStoryScreenshotPreview };
