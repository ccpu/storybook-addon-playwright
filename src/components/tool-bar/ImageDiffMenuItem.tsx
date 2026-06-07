import type { ImageDiffResult } from '../../api/typings';
import { makeStyles } from '@mui/styles';
import { ListItem } from '@storybook/components';
import { useStorybookApi } from '@storybook/manager-api';
import React, { useCallback } from 'react';
import { SCREENSHOT_PANEL_ID } from '../../constants';

const useStyles = makeStyles(
  (theme) => {
    return {
      notFound: {
        '& *': {
          color: theme.palette.error.main,
        },
      },
    };
  },
  { name: 'ImageDiff' },
);

export interface ImageDiffMenuItemProps {
  imageDiff: ImageDiffResult;
  onClick: () => void;
}

const ImageDiffMenuItem: React.FC<ImageDiffMenuItemProps> = (props) => {
  const { imageDiff, onClick } = props;

  const api = useStorybookApi();

  const classes = useStyles();

  const { storyId } = imageDiff;

  const data = storyId ? api.getData(storyId) : undefined;

  const handleLoadStory = useCallback(() => {
    if (!storyId) return;

    onClick();
    api.selectStory(storyId);
    api.setSelectedPanel(SCREENSHOT_PANEL_ID);
  }, [api, onClick, storyId]);

  if (!data) {
    return (
      <ListItem
        className={classes.notFound}
        style={{
          color: 'red',
        }}
        title={
          <span
            style={{
              display: 'block',
            }}
          >
            <b>Unable to locate story!</b>

            <span style={{ display: 'block' }}>
              <b>ID:</b> {props.imageDiff.storyId}
            </span>

            <span style={{ display: 'block' }}>
              <b>File:</b> {props.imageDiff.filePath}
            </span>
          </span>
        }
      ></ListItem>
    );
  }

  return <ListItem onClick={handleLoadStory} title={`${data.parent}--${data.name}`} />;
};

ImageDiffMenuItem.displayName = 'ImageDiffMenuItem';

export { ImageDiffMenuItem };
