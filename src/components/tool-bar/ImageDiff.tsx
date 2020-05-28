import React, { SFC, useCallback } from 'react';
import { Menu, makeStyles, Badge, MenuItem } from '@material-ui/core';
import { IconButton } from '@storybook/components';
import Compare from '@material-ui/icons/Compare';
import {
  useGlobalImageDiffResult,
  useAppScreenshotImageDiff,
  useGlobalScreenshotDispatch,
} from '../../hooks';
import { Loader } from '../common';
import { ImageDiffMenuItem } from './ImageDiffMenuItem';

const useStyles = makeStyles(
  () => {
    return {
      button: {},
      imageDiffBadge: {
        '& span': {
          fontSize: '.6rem',
          height: 14,
          minWidth: 15,
          padding: '0 4px',
        },
        position: 'absolute',
        right: -2,
        top: 10,
      },
    };
  },
  { name: 'ImageDiff' },
);

interface ImageDiffStyleProps {
  classes?: {
    button?: string;
  };
}

const ImageDiff: SFC<ImageDiffStyleProps> = (props) => {
  const classes = useStyles({ classes: props.classes });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { imageDiffResult } = useGlobalImageDiffResult();

  const { dispatch } = useGlobalScreenshotDispatch();

  const {
    testStoryScreenShots,
    imageDiffTestInProgress,
  } = useAppScreenshotImageDiff();

  const handleImageDiffClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (anchorEl) return;
      if (imageDiffResult.length > 0) {
        setAnchorEl(event.currentTarget);
      } else {
        testStoryScreenShots();
      }
    },
    [anchorEl, imageDiffResult.length, testStoryScreenShots],
  );

  const handleClose = useCallback(() => {
    console.log('close');
    setAnchorEl(null);
  }, []);

  const handleClearAllResults = useCallback(() => {
    setAnchorEl(null);
    dispatch({ imageDiffResults: [], type: 'setImageDiffResults' });
  }, [dispatch]);

  return (
    <IconButton
      title="Run diff test for all stories"
      className={classes.button}
      onClick={handleImageDiffClick}
      style={{ position: 'relative' }}
      disabled={imageDiffTestInProgress}
    >
      <Badge
        badgeContent={imageDiffResult.length}
        color="secondary"
        className={classes.imageDiffBadge}
      />
      <Compare viewBox="1.5 -2 20 20" />

      {imageDiffResult.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClearAllResults}>Clear all results</MenuItem>
          {imageDiffResult.map((diff) => (
            <ImageDiffMenuItem
              key={diff.storyId + diff.screenshotHash}
              imageDiff={diff}
              onClick={handleClose}
            />
          ))}
        </Menu>
      )}

      <Loader
        position="absolute"
        open={imageDiffTestInProgress}
        progressSize={15}
      />
    </IconButton>
  );
};

ImageDiff.displayName = 'ImageDiff';

export { ImageDiff };
