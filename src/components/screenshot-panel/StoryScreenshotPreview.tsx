import React, { SFC } from 'react';
import { ScreenshotData, StoryData } from '../../typings';
import { useStoryScreenshotsDiff } from '../../hooks';
import { Loader } from '../common';
import { ScreenshotPreviewList } from './ScreenshotPreviewList';

export interface StoryScreenshotPreviewProps {
  screenshotsData: ScreenshotData[];
  onFinish: () => void;
  storyData: StoryData;
  updating?: boolean;
}

const StoryScreenshotPreview: SFC<StoryScreenshotPreviewProps> = (props) => {
  const { screenshotsData, storyData, onFinish } = props;

  const { loading } = useStoryScreenshotsDiff(storyData);

  return (
    <>
      <Loader open={loading} />
      {!loading && (
        <ScreenshotPreviewList
          screenshots={screenshotsData}
          onClose={onFinish}
          open={true}
          storyData={storyData}
        />
      )}
    </>
  );
};

StoryScreenshotPreview.displayName = 'StoryScreenshotPreview';

export { StoryScreenshotPreview };
