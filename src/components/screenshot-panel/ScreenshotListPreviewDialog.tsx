import React, { SFC, useCallback, useState, useEffect } from 'react';
import { StoryData, ScreenshotData } from '../../typings';
import { Dialog, DialogProps, ImageDiffPreview } from '../common';
import { makeStyles, capitalize } from '@material-ui/core';
import { useScreenshotContext } from '../../store/screenshot';
import { SortableScreenshotListItem } from './ScreenshotListItem';
import { ScreenshotListSortable } from './ScreenshotListSortable';

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

  const [currentItem, setCurrentItem] = useState<ScreenshotData>();

  const state = useScreenshotContext();

  const classes = useStyles();

  const handleItemClick = useCallback(async (screenshot: ScreenshotData) => {
    setCurrentItem(screenshot);
  }, []);

  useEffect(() => {
    if (
      state.imageDiffResults &&
      state.imageDiffResults.length &&
      screenshots &&
      !currentItem
    ) {
      if (selectedItem) {
        handleItemClick(screenshots.find((x) => x.id === selectedItem));
      } else if (screenshots[0]) {
        handleItemClick(screenshots[0]);
      }
    }
  }, [
    currentItem,
    handleItemClick,
    screenshots,
    selectedItem,
    state.imageDiffResults,
  ]);

  const diffResult =
    currentItem &&
    state.imageDiffResults.find((x) => x.screenshotId === currentItem.id);

  return (
    <Dialog
      width="100%"
      title={
        title
          ? title
          : currentItem
          ? capitalize(currentItem.title)
          : 'Loading ...'
      }
      subtitle={title && currentItem && currentItem.title}
      height="100%"
      {...rest}
    >
      <div className={classes.root}>
        <div className={classes.list}>
          <ScreenshotListSortable>
            {currentItem &&
              screenshots.map((screenshot, i) => (
                <SortableScreenshotListItem
                  index={i}
                  openUpdateDialog={false}
                  showPreviewOnClick={false}
                  key={screenshot.id}
                  screenshot={screenshot}
                  forceShowMenu={true}
                  enableUpdate={true}
                  draggable={true}
                  storyData={storyData}
                  pauseDeleteImageDiffResult={state.pauseDeleteImageDiffResult}
                  onClick={handleItemClick}
                  selected={currentItem.id === screenshot.id}
                  imageDiffResult={state.imageDiffResults.find(
                    (x) =>
                      x.storyId === storyData.id &&
                      x.screenshotId === screenshot.id,
                  )}
                />
              ))}
          </ScreenshotListSortable>
        </div>

        <div className={classes.line} />
        {diffResult && <ImageDiffPreview imageDiffResult={diffResult} />}
        {children}
      </div>
    </Dialog>
  );
};

ScreenshotListPreviewDialog.displayName = 'ScreenshotListPreviewDialog';

export { ScreenshotListPreviewDialog };
