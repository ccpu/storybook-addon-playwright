/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  BrowserIcon,
  MemoizedImageDiffMessage,
  Loader,
} from '../../../../components/common';
import { ScreenshotData } from '../../../../typings';
import { removeImageDiffResult } from '../../store/actions';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ScreenshotListItemMenu,
  ScreenshotListItemMenuProps,
} from './ScreenshotListItemMenu';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import { useDragStart } from '../../../../hooks/use-drag-start';
import { useEditScreenshot } from '../../hooks/use-edit-screenshot';
import { useScreenshotDiffTest } from '../../hooks/use-screenshot-diff-test';
import { ScreenshotInfo } from './ScreenshotInfo';
import { makeStyles } from '@material-ui/core';
import { ImageDiffResult } from '../../../../api/typings';
import { ScreenshotPreviewDialog } from './ScreenshotPreviewDialog';
import { ScreenshotListItemWrapper } from './ScreenshotListItemWrapper';
import { StoryData } from '../../../../schema';

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

export interface ScreenshotListItemProps
  extends Omit<ScreenshotListItemMenuProps, 'onDelete'> {
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
  index?: number;
  sortableId?: string;
}

function ScreenshotListItem({
  pauseDeleteImageDiffResult,
  showPreviewOnClick,
  screenshot,
  sortableId,
  imageDiffResult,
  selected,
  onClick,
  draggable,
  forceShowMenu,
  showImageDiffResultDialog,
  storyData,
  ...rest
}: ScreenshotListItemProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    disabled: !draggable,
    id: sortableId ?? screenshot.id,
  });

  const classes = useStyles();

  const [showMenu, setShowMenu] = useState(false);
  const [showImageDiffResult, setShowImageDiffResult] = useState(false);

  const timer = useRef(0);

  const { dragStart } = useDragStart();

  const [showPreview, setShowPreview] = useState(false);

  const { inProgress, testScreenshot } = useScreenshotDiffTest();

  const isPassesImageDiff = imageDiffResult && imageDiffResult.pass;

  const handleRemoveScreenShotResult = useCallback(() => {
    setShowImageDiffResult(false);
    if (
      !pauseDeleteImageDiffResult &&
      isPassesImageDiff &&
      imageDiffResult?.screenshotId
    ) {
      removeImageDiffResult(imageDiffResult.screenshotId);
    } else {
      window.clearTimeout(timer.current);
    }
  }, [pauseDeleteImageDiffResult, isPassesImageDiff, imageDiffResult]);

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
    return () => {
      window.clearTimeout(timer.current);
    };
  }, [
    pauseDeleteImageDiffResult,
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
    await testScreenshot({ ...storyData, screenshotId: screenshot.id });
    setShowImageDiffResult(true);
  }, [screenshot.id, storyData, testScreenshot]);

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
    clearScreenshotEdit,
  } = useEditScreenshot();

  const handleEdit = useCallback(
    () => editScreenshot(screenshot),
    [editScreenshot, screenshot],
  );

  const handleLoadSetting = useCallback(() => {
    loadSetting(screenshot);
  }, [loadSetting, screenshot]);

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.8 : 1,
        // position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        // zIndex: 1,
      }}
    >
      <ScreenshotListItemWrapper
        onClick={toggleSelectedItem}
        title={screenshot.title}
        draggable={draggable}
        selected={
          selected ||
          (editScreenshotState &&
            editScreenshotState.screenshotData.id === screenshot.id)
        }
        tooltip={screenshot.title + (storyData && ` - ${storyData.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        dragHandleProps={
          draggable
            ? {
                ...(attributes as React.HTMLAttributes<HTMLSpanElement>),
                ...(listeners as React.HTMLAttributes<HTMLSpanElement>),
                setNodeRef: setActivatorNodeRef as (
                  element: HTMLSpanElement | null,
                ) => void,
              }
            : undefined
        }
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

          {showImageDiffResult &&
            showImageDiffResultDialog &&
            imageDiffResult && (
              <MemoizedImageDiffMessage
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
          <ScreenshotListItemMenu
            show={(forceShowMenu || showMenu) && !dragStart}
            screenshot={screenshot}
            onHide={handleMouseLeave}
            onRunImageDiff={handleRunDiffTest}
            imageDiffResult={imageDiffResult}
            onEditClick={handleEdit}
            onLoadSettingClick={handleLoadSetting}
            isEditing={Boolean(editScreenshotState)}
            onDelete={clearScreenshotEdit}
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
    </div>
  );
}

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { ScreenshotListItem as SortableScreenshotListItem };
