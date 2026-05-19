import type { DialogProps } from '../../../../components/common';
import type { StoryData } from '../../../../schema';
import type { ScreenshotData } from '../../../../typings';
import { capitalize } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, ImageDiffPreview } from '../../../../components/common';
import { useKeyPressFn } from '../../../../hooks/use-key-press-fn';
import { useScreenshotStoreState } from '../../store/selectors';
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
  draggable?: boolean;
}

const ScreenshotListPreviewDialog: React.FC<
  ScreenshotListPreviewDialogProps & DialogProps
> = ({
  screenshots,
  storyData,
  selectedItem,
  title,
  children,
  draggable = true,
  ...rest
}) => {
  const [currentItem, setCurrentItem] = useState<ScreenshotData>();

  const state = useScreenshotStoreState();

  const classes = useStyles();

  const handleItemClick = useCallback(async (screenshot: ScreenshotData) => {
    setCurrentItem(screenshot);
  }, []);

  const handleKeyUp = useCallback(
    (ev: KeyboardEvent) => {
      if (!currentItem) return;
      const index = screenshots.findIndex((x) => x.id === currentItem.id);
      switch (ev.key) {
        case 'ArrowDown': {
          if (screenshots[index + 1]) {
            setCurrentItem(screenshots[index + 1]);
          }
          break;
        }
        case 'ArrowUp': {
          if (screenshots[index - 1]) {
            setCurrentItem(screenshots[index - 1]);
          }
          break;
        }
        default:
          break;
      }
    },
    [currentItem, screenshots],
  );

  useKeyPressFn(undefined, handleKeyUp);

  useEffect(() => {
    if (
      state.imageDiffResults &&
      state.imageDiffResults.length &&
      screenshots &&
      !currentItem
    ) {
      if (selectedItem) {
        const selectedScreenshot = screenshots.find((x) => x.id === selectedItem);
        if (selectedScreenshot) {
          handleItemClick(selectedScreenshot);
        }
      } else if (screenshots[0]) {
        handleItemClick(screenshots[0]);
      }
    }
  }, [currentItem, handleItemClick, screenshots, selectedItem, state.imageDiffResults]);

  const diffResult =
    currentItem && state.imageDiffResults.find((x) => x.screenshotId === currentItem.id);

  return (
    <Dialog
      width="100%"
      title={title || (currentItem ? capitalize(currentItem.title) : 'Loading ...')}
      subtitle={
        (title && currentItem && currentItem.title) + (storyData && ` (${storyData.id})`)
      }
      height="100%"
      {...rest}
    >
      <div className={classes.root}>
        <div className={classes.list}>
          <ScreenshotListSortable items={screenshots.map((x) => x.id)}>
            {currentItem &&
              screenshots.map((screenshot, i) => (
                <SortableScreenshotListItem
                  index={i}
                  sortableId={screenshot.id}
                  openUpdateDialog={false}
                  showPreviewOnClick={false}
                  key={screenshot.id}
                  screenshot={screenshot}
                  forceShowMenu={true}
                  enableUpdate={true}
                  draggable={draggable}
                  storyData={storyData}
                  pauseDeleteImageDiffResult={state.pauseDeleteImageDiffResult}
                  onClick={handleItemClick}
                  selected={currentItem.id === screenshot.id}
                  imageDiffResult={state.imageDiffResults.find(
                    (x) => x.screenshotId === screenshot.id,
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
