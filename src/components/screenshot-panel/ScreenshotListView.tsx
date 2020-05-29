import React, { SFC, useCallback, useState, useEffect } from 'react';
import { ScreenShotPreview, StoryInput } from '../../typings';
import {
  Dialog,
  DialogProps,
  ListWrapper,
  ScreenshotPreview,
  Loader,
} from '../common';
import { makeStyles, capitalize } from '@material-ui/core';
import { useAsyncApiCall } from '../../hooks';
import { testScreenshot as testScreenshotClient } from '../../api/client';
import { ScreenshotListViewItem } from './ScreenshotListViewItem';
import { getImageDiffMessages } from '../../utils';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { divider },
    } = theme;

    return {
      line: {
        backgroundColor: divider,
        width: 1,
      },
      list: {
        width: '350px',
      },
      preview: {
        overflow: 'hidden',
        padding: 5,
        position: 'relative',
        width: '100%',
      },
      root: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
      },
    };
  },
  { name: 'ScreenshotListView' },
);

export interface ScreenshotListViewProps {
  screenshots: ScreenShotPreview[];
  storyData: StoryInput;
  selectedItem: string;
}

const ScreenshotListView: SFC<ScreenshotListViewProps & DialogProps> = (
  props,
) => {
  const { screenshots, storyData, selectedItem, ...rest } = props;

  const [imageSrc, setImageSrc] = useState<string>();
  const [currentItem, setCurrentItem] = useState<ScreenShotPreview>();
  const [error, setError] = useState<string>();

  const { inProgress, makeCall: testScreenshot } = useAsyncApiCall(
    testScreenshotClient,
    false,
  );

  const classes = useStyles();

  const handleItemClick = useCallback(
    async (screenshot: ScreenShotPreview) => {
      setCurrentItem(screenshot);
      setError(undefined);
      if (!screenshot.base64) {
        const result = await testScreenshot({
          fileName: storyData.parameters.fileName,
          hash: screenshot.hash,
          storyId: storyData.id,
        });
        if (!(result instanceof Error)) {
          setImageSrc(result.imgSrcString);
          if (!result.pass) {
            setError(getImageDiffMessages(result));
          }
        }
      } else {
        setImageSrc(screenshot.base64);
      }
    },
    [testScreenshot, storyData],
  );

  useEffect(() => {
    if (screenshots && !currentItem) {
      if (selectedItem) {
        handleItemClick(screenshots.find((x) => x.hash === selectedItem));
      } else if (screenshots[0]) {
        handleItemClick(screenshots[0]);
      }
    }
  }, [currentItem, handleItemClick, screenshots, selectedItem]);

  return (
    <Dialog
      width="100%"
      title={currentItem ? capitalize(currentItem.title) : 'Loading'}
      height="100%"
      {...rest}
    >
      <div className={classes.root}>
        <div className={classes.preview}>
          {error && <Alert color="error">{error}</Alert>}
          {imageSrc && <ScreenshotPreview imgSrcString={imageSrc} />}
          <Loader position="absolute" open={inProgress} />
        </div>
        <div className={classes.line} />
        <ListWrapper className={classes.list}>
          {screenshots.map((screenshot) => (
            <ScreenshotListViewItem
              key={screenshot.hash}
              screenshot={screenshot}
              onClick={handleItemClick}
              selected={currentItem && currentItem.hash === screenshot.hash}
            />
          ))}
        </ListWrapper>
      </div>
    </Dialog>
  );
};

ScreenshotListView.displayName = 'ScreenshotListView';

export { ScreenshotListView };
