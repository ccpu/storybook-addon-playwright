import React, { useCallback, useState, useEffect } from 'react';
import { useScreenshotStoreState } from '../../store/selectors';
import { setPauseDeleteImageDiffResult } from '../../store/actions';
import { Loader } from '../../../../components/common';
import { ScreenshotListToolbar } from './ScreenshotListToolbar';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotList } from './ScreenshotList';
import { useDeleteStoryScreenshot } from '../../hooks/use-delete-story-screenshots';
import { useScreenshotDiffTestByType } from '../../hooks/use-screenshot-diff-test-by-type';
import { useStoryScreenshotLoader } from '../../hooks/use-story-screenshot-loader';
import { useScreenshotUpdateState } from '../../hooks/use-screenshot-update-state';

const ScreenshotPanel = () => {
  const [showPreview, setShowPreview] = useState(false);

  const reqBy = 'screenshot-panel';
  const { runDiffTest, updateInf } = useScreenshotUpdateState(reqBy, 'story');

  const { screenshotLoaderInProgress } = useStoryScreenshotLoader();

  const { deleteInProgress, deleteStoryScreenshots } =
    useDeleteStoryScreenshot();

  const state = useScreenshotStoreState();

  const { testStoryScreenShots, imageDiffTestInProgress } =
    useScreenshotDiffTestByType();

  const toggleShowPreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const hasScreenshot = state.screenshots && state.screenshots.length > 0;

  useEffect(() => {
    setPauseDeleteImageDiffResult(showPreview);
  }, [showPreview]);

  const handleStoryImgDiff = React.useCallback(() => {
    testStoryScreenShots('story');
  }, [testStoryScreenShots]);

  return (
    <>
      <ScreenshotListToolbar
        onUpdateClick={runDiffTest}
        title="Story Screenshots"
        onTestClick={handleStoryImgDiff}
        onPreviewClick={toggleShowPreview}
        hasScreenShot={hasScreenshot}
        onDelete={deleteStoryScreenshots}
      />
      <ScreenshotList>
        <Loader
          open={
            screenshotLoaderInProgress ||
            imageDiffTestInProgress ||
            deleteInProgress ||
            updateInf.reqBy !== undefined
          }
        />
      </ScreenshotList>
      {showPreview && (
        <StoryScreenshotPreview onClose={toggleShowPreview} target="story" />
      )}
    </>
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
