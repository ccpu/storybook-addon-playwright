import React, { SFC, useCallback, useState, useEffect } from 'react';
import { StoryData, ScreenshotData } from '../../typings';
import { Dialog, DialogProps, ListWrapper, ImageDiffPreview } from '../common';
import { makeStyles, capitalize } from '@material-ui/core';
import { ImageDiffResult } from '../../api/typings';
import { useScreenshotContext } from '../../store/screenshot';
import { ScreenshotListItem } from './ScreenshotListItem';

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
      root: {
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100% - 70px) !important',
        position: 'relative',
        width: '100%',
      },
    };
  },
  { name: 'ScreenshotListPreviewDialog' },
);

export interface ScreenshotListPreviewDialogProps {
  screenshots: ScreenshotData[];
  storyData: StoryData;
  selectedItem?: string;
  title?: string;
}

const ScreenshotListPreviewDialog: SFC<
  ScreenshotListPreviewDialogProps & DialogProps
> = (props) => {
  const {
    screenshots,
    storyData,
    selectedItem,
    title,
    children,
    ...rest
  } = props;

  const [currentItem, setCurrentItem] = useState<{
    imageDiff: ImageDiffResult;
    data: ScreenshotData;
  }>();

  const state = useScreenshotContext();

  const classes = useStyles();

  const handleItemClick = useCallback(
    async (screenshot: ScreenshotData) => {
      const diffResult = state.imageDiffResults.find(
        (x) => x.screenshotHash === screenshot.hash,
      );

      setCurrentItem({ data: screenshot, imageDiff: diffResult });
    },
    [state.imageDiffResults],
  );

  useEffect(() => {
    if (
      state.imageDiffResults &&
      state.imageDiffResults.length &&
      screenshots &&
      !currentItem
    ) {
      if (selectedItem) {
        handleItemClick(screenshots.find((x) => x.hash === selectedItem));
      } else if (screenshots[0]) {
        handleItemClick(screenshots[0]);
      }
    }
    () => {
      console.log('unm');
    };
  }, [
    currentItem,
    handleItemClick,
    screenshots,
    selectedItem,
    state.imageDiffResults,
  ]);

  return (
    <Dialog
      width="100%"
      title={
        title
          ? title
          : currentItem
          ? capitalize(currentItem.data.title)
          : 'Loading ...'
      }
      subtitle={title && currentItem && currentItem.data.title}
      height="100%"
      {...rest}
    >
      <div className={classes.root}>
        <ListWrapper className={classes.list}>
          {currentItem &&
            screenshots.map((screenshot) => (
              <ScreenshotListItem
                key={screenshot.hash}
                screenshot={screenshot}
                storyInput={storyData}
                onClick={handleItemClick}
                selected={currentItem.data.hash === screenshot.hash}
                imageDiffResult={state.imageDiffResults.find(
                  (x) =>
                    x.storyId === storyData.id &&
                    x.screenshotHash === screenshot.hash,
                )}
              />
            ))}
        </ListWrapper>
        <div className={classes.line} />
        {currentItem && currentItem.imageDiff && (
          <ImageDiffPreview imageDiffResult={currentItem.imageDiff} />
        )}
        {children}
      </div>
    </Dialog>
  );
};

ScreenshotListPreviewDialog.displayName = 'ScreenshotListPreviewDialog';

export { ScreenshotListPreviewDialog };
