import React, { SFC } from 'react';
import { useStoryScreenshotImageDiff, useCurrentStoryData } from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, Snackbar } from '../common';
import { SortableScreenshotListItem } from './ScreenshotListItem';
import { ScreenshotListSortable } from './ScreenshotListSortable';
import { Button } from '@material-ui/core';

const ScreenshotList: SFC = ({ children }) => {
  const storyData = useCurrentStoryData();

  const state = useScreenshotContext();

  const {
    testStoryScreenShots,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
  } = useStoryScreenshotImageDiff(storyData);

  const hasScreenshot = state.screenshots && state.screenshots.length > 0;

  return (
    <>
      <ScreenshotListSortable>
        {hasScreenshot ? (
          <>
            {state.screenshots
              .sort((a, b) => a.index - b.index)
              .map((screenshot, index) => (
                <SortableScreenshotListItem
                  index={index}
                  openUpdateDialog={true}
                  key={screenshot.hash}
                  screenshot={screenshot}
                  storyData={storyData}
                  showPreviewOnClick={true}
                  draggable={true}
                  enableImageDiff={true}
                  enableUpdate={true}
                  showImageDiffResultDialog={true}
                  enableLoadSetting={true}
                  enableEditScreenshot={true}
                  pauseDeleteImageDiffResult={state.pauseDeleteImageDiffResult}
                  imageDiffResult={state.imageDiffResults.find(
                    (x) => x.screenshotHash === screenshot.hash,
                  )}
                />
              ))}
          </>
        ) : (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <div>No screenshot has been found!</div>
          </div>
        )}
        <Loader open={imageDiffTestInProgress} />
        {children}
      </ScreenshotListSortable>

      {storyImageDiffError && (
        <Snackbar
          open={true}
          action={
            <Button color="inherit" onClick={testStoryScreenShots}>
              Retry
            </Button>
          }
          variant="error"
          message={storyImageDiffError}
          onClose={clearImageDiffError}
        />
      )}
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
