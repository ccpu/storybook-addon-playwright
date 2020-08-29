/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { BrowserIcon, ImageDiffMessage, Loader } from '../common';
import { ScreenshotData, StoryData } from '../../typings';
import { useScreenshotDispatch } from '../../store/screenshot';
import { SortableElement } from 'react-sortable-hoc';
import {
  ScreenshotListItemMenu,
  ScreenshotListItemMenuProps,
} from './ScreenshotListItemMenu';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import {
  useScreenshotImageDiff,
  useDragStart,
  useEditScreenshot,
} from '../../hooks';
import { ScreenshotInfo } from './ScreenshotInfo';
import { makeStyles } from '@material-ui/core';
import { ImageDiffResult } from '../../api/typings';
import { ScreenshotPreviewDialog } from './ScreenshotPreviewDialog';
import { ScreenshotListItemWrapper } from './ScreenshotListItemWrapper';

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
  forceShowMenu?: boolean;
  draggable?: boolean;
  imageDiffResult?: ImageDiffResult;
  showImageDiffResultDialog?: boolean;
  storyData: StoryData;
  showPreviewOnClick?: boolean;
  pauseDeleteImageDiffResult?: boolean;
  openUpdateDialog?: boolean;
}

function ScreenshotListItem({
  pauseDeleteImageDiffResult,
  showPreviewOnClick,
  screenshot,
  imageDiffResult,
  selected,
  onClick,
  draggable,
  forceShowMenu,
  showImageDiffResultDialog,
  storyData,
  ...rest
}: ScreenshotListItemProps) {
  const dispatch = useScreenshotDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [showImageDiffResult, setShowImageDiffResult] = useState(false);

  const timer = useRef(0);

  const { dragStart } = useDragStart();

  const classes = useStyles();

  const [showPreview, setShowPreview] = useState(false);

  const {
    inProgress,
    testScreenshot,
    TestScreenshotErrorSnackbar,
  } = useScreenshotImageDiff(storyData);

  const isPassesImageDiff = imageDiffResult && imageDiffResult.pass;

  const handleRemoveScreenShotResult = useCallback(() => {
    setShowImageDiffResult(false);
    if (!pauseDeleteImageDiffResult && isPassesImageDiff) {
      dispatch({
        screenshotId: imageDiffResult.screenshotId,
        type: 'removeImageDiffResult',
      });
    } else {
      window.clearTimeout(timer.current);
    }
  }, [
    pauseDeleteImageDiffResult,
    isPassesImageDiff,
    dispatch,
    imageDiffResult,
  ]);

  useEffect(() => {
    if (
      !pauseDeleteImageDiffResult &&
      imageDiffResult &&
      imageDiffResult.pass
    ) {
      timer.current = window.setTimeout(() => {
        handleRemoveScreenShotResult();
      }, 10000);
    }
    () => {
      window.clearTimeout(timer.current);
    };
  }, [
    pauseDeleteImageDiffResult,
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
    await testScreenshot(screenshot.id);
    setShowImageDiffResult(true);
  }, [screenshot.id, testScreenshot]);

  const toggleSelectedItem = useCallback(() => {
    if (onClick) onClick(screenshot);
    if (showPreviewOnClick) {
      setShowPreview(!showPreview);
    }
  }, [onClick, screenshot, showPreview, showPreviewOnClick]);

  const {
    editScreenshot,
    loadSetting,
    editScreenshotState,
  } = useEditScreenshot();

  const handleEdit = useCallback(() => editScreenshot(screenshot), [
    editScreenshot,
    screenshot,
  ]);

  const handleLoadSetting = useCallback(() => {
    loadSetting(screenshot);
  }, [loadSetting, screenshot]);

  return (
    <ScreenshotListItemWrapper
      onClick={toggleSelectedItem}
      title={screenshot.title}
      draggable={draggable}
      selected={
        selected ||
        (editScreenshotState &&
          editScreenshotState.screenshotData.id === screenshot.id)
      }
      tooltip={screenshot.title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: 'pointer',
      }}
    >
      <>
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
          imageDiffResult={imageDiffResult}
          onEditClick={handleEdit}
          onLoadSettingClick={handleLoadSetting}
          isEditing={Boolean(editScreenshotState)}
          {...rest}
        />

        {showPreview && showPreviewOnClick && (
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
      </>
    </ScreenshotListItemWrapper>
  );
}

const MemoizedScreenshotListItem = React.memo(ScreenshotListItem);

const SortableScreenshotListItem = SortableElement(MemoizedScreenshotListItem);

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { SortableScreenshotListItem, ScreenshotListItem };
