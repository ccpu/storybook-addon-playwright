import React from 'react';
import { useCurrentStoryData } from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';

import { SortableScreenshotListItem } from './ScreenshotListItem';
import { ScreenshotListSortable } from './ScreenshotListSortable';

const ScreenshotList: React.FC = ({ children }) => {
  const storyData = useCurrentStoryData();

  const state = useScreenshotContext();

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
                  key={screenshot.id}
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
                    (x) => x.screenshotId === screenshot.id,
                  )}
                />
              ))}
          </>
        ) : (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <div>No screenshot has been found!</div>
          </div>
        )}

        {children}
      </ScreenshotListSortable>
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
