import React, { SFC, useCallback } from 'react';
import { ScreenShotPreview } from '../../typings';
import { ListItemWrapper } from '../common';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { primary },
    } = theme;

    return {
      item: {
        '&:hover': {
          border: '1px solid ' + primary.main,
          cursor: 'pointer',
        },
      },
    };
  },
  { name: 'ScreenshotListViewItem' },
);

export interface ScreenshotListViewItemProps {
  screenshot: ScreenShotPreview;
  onClick: (screenshot: ScreenShotPreview) => void;
  selected: boolean;
}

const ScreenshotListViewItem: SFC<ScreenshotListViewItemProps> = (props) => {
  const { screenshot, selected, onClick } = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(screenshot);
  }, [onClick, screenshot]);

  return (
    <ListItemWrapper
      className={classes.item}
      key={screenshot.hash}
      title={screenshot.title}
      onClick={handleClick}
      selected={selected}
    />
  );
};

ScreenshotListViewItem.displayName = 'ScreenshotListViewItem';

export { ScreenshotListViewItem };
