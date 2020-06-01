/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from 'react';
import { ListItemWrapper, BrowserIcon } from '../common';
import { ScreenshotData } from '../../typings';
import { useScreenshotDispatch } from '../../store/screenshot';
import { SortableElement } from 'react-sortable-hoc';
import {
  ScreenshotListItemMenu,
  ScreenshotListItemMenuProps,
} from './ScreenshotListItemMenu';

export interface ScreenshotListItemProps extends ScreenshotListItemMenuProps {
  onClick: (item: ScreenshotData) => void;
  selected?: boolean;
  dragStart?: boolean;
}

function ScreenshotListItem({
  screenshot,
  imageDiffResult,
  onClick,
  deletePassedImageDiffResult,
  selected,
  dragStart,
  ...rest
}: ScreenshotListItemProps) {
  const dispatch = useScreenshotDispatch();

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (
      deletePassedImageDiffResult &&
      imageDiffResult &&
      imageDiffResult.pass
    ) {
      setTimeout(() => {
        dispatch({
          screenshotHash: imageDiffResult.screenshotHash,
          type: 'removeImageDiffResult',
        });
      }, 10000);
    }
  }, [deletePassedImageDiffResult, dispatch, imageDiffResult]);

  const handleItemClick = useCallback(() => {
    onClick(screenshot);
  }, [onClick, screenshot]);

  const handleMouseEnter = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowMenu(false);
  }, []);

  return (
    <ListItemWrapper
      onClick={handleItemClick}
      title={screenshot.title}
      draggable={true}
      selected={selected}
      tooltip={screenshot.title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: 'pointer',
      }}
    >
      <BrowserIcon
        style={{ height: 16 }}
        browserType={screenshot.browserType}
      />

      <ScreenshotListItemMenu
        show={showMenu && !dragStart}
        screenshot={screenshot}
        onHide={handleMouseLeave}
        {...rest}
      />
    </ListItemWrapper>
  );
}
const SortableScreenshotListItem = SortableElement(ScreenshotListItem);

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { SortableScreenshotListItem, ScreenshotListItem };
