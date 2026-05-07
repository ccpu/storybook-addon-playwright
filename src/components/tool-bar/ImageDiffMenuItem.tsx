import type { ImageDiffResult } from '../../api/typings';
import { makeStyles } from '@material-ui/core';
import { ListItem } from '@storybook/components';
import { useStorybookApi } from '@storybook/manager-api';
import React, { useCallback } from 'react';
import { SCREENSHOT_PANEL_ID } from '../../constants';

const useStyles = makeStyles(
  (theme) => {
    return {
      notFound: {
        '& > div': {
          '& > b': {
            color: theme.palette.error.main,
          },
          '& > p': {
            margin: 0,
          },
          fontSize: 14,
        },
        border: `1px solid ${theme.palette.error.main}`,
        marginBottom: 2,
        marginTop: 2,
        pointerEvents: 'none',
        userSelect: 'text',
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
      <ListItem className={classes.notFound} title="Unable to locate story!">
        <div>
          <b>Unable to locate story!</b>

          <p>
            <b>ID:</b> {props.imageDiff.storyId}
          </p>

          <p>
            <b>File:</b> {props.imageDiff.filePath}
          </p>
        </div>
      </ListItem>
    );
  }

  return <ListItem onClick={handleLoadStory} title={`${data.parent}--${data.name}`} />;
};

ImageDiffMenuItem.displayName = 'ImageDiffMenuItem';

export { ImageDiffMenuItem };
