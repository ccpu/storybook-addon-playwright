/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from 'react';
import {
  ListItemWrapper,
  BrowserIcon,
  ImageDiffMessage,
  Loader,
} from '../common';
import { ScreenshotData, StoryData } from '../../typings';
import { useScreenshotDispatch } from '../../store/screenshot';
import { SortableElement } from 'react-sortable-hoc';
import {
  ScreenshotListItemMenu,
  ScreenshotListItemMenuProps,
} from './ScreenshotListItemMenu';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import { useScreenshotImageDiff } from '../../hooks';
import { ScreenshotInfo } from './ScreenshotInfo';
import { makeStyles } from '@material-ui/core';
import { ImageDiffResult } from '../../api/typings';
import { ScreenshotPreviewDialog } from './ScreenshotPreviewDialog';

const useStyles = makeStyles(
  () => {
    return {
      indicatorIcon: {
        height: 16,
        position: 'absolute',
        right: -1,
        top: 0,
        zIndex: 1,
      },
      visible: {
        display: 'block',
      },
    };
  },
  { name: 'ScreenshotListItemMenu' },
);

export interface ScreenshotListItemProps extends ScreenshotListItemMenuProps {
  onClick?: (item: ScreenshotData) => void;
  selected?: boolean;
  dragStart?: boolean;
  forceShowMenu?: boolean;
  draggable?: boolean;
  imageDiffResult?: ImageDiffResult;
  deletePassedImageDiffResult?: boolean;
  showImageDiffResultDialog?: boolean;
  storyData: StoryData;
}

function ScreenshotListItem({
  screenshot,
  imageDiffResult,
  deletePassedImageDiffResult,
  selected,
  onClick,
  dragStart,
  draggable,
  forceShowMenu,
  showImageDiffResultDialog,
  storyData,
  ...rest
}: ScreenshotListItemProps) {
  const dispatch = useScreenshotDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [showImageDiffResult, setShowImageDiffResult] = useState(false);

  const classes = useStyles();

  const [showPreview, setShowPreview] = useState(false);

  const {
    inProgress,
    testScreenshot,
    TestScreenshotErrorSnackbar,
  } = useScreenshotImageDiff(storyData);

  const handleRemoveScreenShotResult = useCallback(() => {
    setShowImageDiffResult(false);
    if (deletePassedImageDiffResult && imageDiffResult.pass) {
      dispatch({
        screenshotHash: imageDiffResult.screenshotHash,
        type: 'removeImageDiffResult',
      });
    }
  }, [deletePassedImageDiffResult, dispatch, imageDiffResult]);

  useEffect(() => {
    if (
      deletePassedImageDiffResult &&
      imageDiffResult &&
      imageDiffResult.pass
    ) {
      setTimeout(() => {
        handleRemoveScreenShotResult();
      }, 10000);
    }
  }, [
    deletePassedImageDiffResult,
    dispatch,
    handleRemoveScreenShotResult,
    imageDiffResult,
  ]);

  const handleShowImageDiffResult = useCallback(() => {
    setShowImageDiffResult(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleRunDiffTest = useCallback(async () => {
    await testScreenshot(screenshot.hash);
    setShowImageDiffResult(true);
  }, [screenshot.hash, testScreenshot]);

  const toggleSelectedItem = useCallback(() => {
    if (onClick) onClick(screenshot);
    setShowPreview(!showPreview);
  }, [onClick, screenshot, showPreview]);

  const isPassesImageDiff = imageDiffResult && imageDiffResult.pass;

  return (
    <ListItemWrapper
      onClick={toggleSelectedItem}
      title={screenshot.title}
      draggable={draggable}
      selected={selected}
      tooltip={screenshot.title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: 'pointer',
      }}
    >
      <Loader progressSize={20} position="absolute" open={inProgress} />

      {isPassesImageDiff && (
        <CheckCircle
          color="primary"
          onClick={handleRemoveScreenShotResult}
          className={classes.indicatorIcon}
        />
      )}

      {imageDiffResult && !imageDiffResult.pass && (
        <Error
          color="secondary"
          onClick={handleShowImageDiffResult}
          className={classes.indicatorIcon}
        />
      )}

      <BrowserIcon
        style={{ height: 16 }}
        browserType={screenshot.browserType}
      />

      {showImageDiffResult && showImageDiffResultDialog && (
        <ImageDiffMessage
          result={imageDiffResult}
          onClose={handleRemoveScreenShotResult}
          title={screenshot.title}
          titleActions={() => (
            <ScreenshotInfo
              color="primary"
              size="medium"
              screenshotData={screenshot}
            />
          )}
        />
      )}

      <TestScreenshotErrorSnackbar />
      <ScreenshotListItemMenu
        show={(forceShowMenu || showMenu) && !dragStart}
        screenshot={screenshot}
        onHide={handleMouseLeave}
        onRunImageDiff={handleRunDiffTest}
        {...rest}
      />

      {showPreview && (
        <ScreenshotPreviewDialog
          screenShotData={screenshot}
          storyData={storyData}
          onClose={toggleSelectedItem}
          open={true}
          width="100%"
          height="100%"
          activeTab={!isPassesImageDiff ? 'imageDiff' : 'newScreenshot'}
        />
      )}
    </ListItemWrapper>
  );
}
const SortableScreenshotListItem = SortableElement(ScreenshotListItem);

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { SortableScreenshotListItem, ScreenshotListItem };
