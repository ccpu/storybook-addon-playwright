import React, { forwardRef, Ref, useCallback } from 'react';
import { ImageDiffResult } from '../../api/typings';
import { MenuItem, makeStyles } from '@material-ui/core';
import { useStorybookApi } from '@storybook/api';
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
        border: '1px solid ' + theme.palette.error.main,
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

const ImageDiffMenuItem: React.FC<ImageDiffMenuItemProps> = forwardRef(
  (props, ref: Ref<HTMLLIElement>) => {
    const { imageDiff, onClick } = props;

    const api = useStorybookApi();

    const classes = useStyles();

    const data = api.getData(imageDiff.storyId);

    const handleLoadStory = useCallback(() => {
      onClick();
      api.selectStory(imageDiff.storyId);
      api.setSelectedPanel(SCREENSHOT_PANEL_ID);
    }, [api, imageDiff.storyId, onClick]);

    if (!data) {
      return (
        <MenuItem className={classes.notFound} ref={ref}>
          <div>
            <b>Unable to locate story!</b>

            <p>
              <b>ID:</b> {props.imageDiff.storyId}
            </p>

            <p>
              <b>File:</b> {props.imageDiff.fileName}
            </p>
          </div>
        </MenuItem>
      );
    }

    return (
      <MenuItem onClick={handleLoadStory} ref={ref}>
        {data.parent + '--' + data.name}
      </MenuItem>
    );
  },
);

ImageDiffMenuItem.displayName = 'ImageDiffMenuItem';

export { ImageDiffMenuItem };
