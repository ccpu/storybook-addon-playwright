import React, { SFC, useCallback, useState } from 'react';
import {
  Menu,
  makeStyles,
  Badge,
  MenuItem,
  ClickAwayListener,
} from '@material-ui/core';
import { IconButton } from '@storybook/components';
import Compare from '@material-ui/icons/Compare';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {
  useGlobalImageDiffResults,
  useAppScreenshotImageDiff,
  useGlobalScreenshotDispatch,
} from '../../hooks';
import { Loader, Snackbar } from '../common';
import { ImageDiffMenuItem } from './ImageDiffMenuItem';

const useStyles = makeStyles(
  (theme) => {
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
      successIcon: {
        color: theme.palette.primary.main,
        position: 'absolute',
        right: -10,
        top: -4,
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

  const [success, setSuccess] = useState(false);

  const { imageDiffResult } = useGlobalImageDiffResults();

  const { dispatch } = useGlobalScreenshotDispatch();

  const {
    testStoryScreenShots,
    imageDiffTestInProgress,
    ErrorSnackbar,
  } = useAppScreenshotImageDiff();

  const handleImageDiffClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      //fixes menu close
      if (anchorEl) return;
      if (imageDiffResult.length > 0) {
        setAnchorEl(event.currentTarget);
      } else {
        const result = await testStoryScreenShots();
        if (!(result instanceof Error)) setSuccess(result.length === 0);
      }
    },
    [anchorEl, imageDiffResult.length, testStoryScreenShots],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClearAllResults = useCallback(() => {
    setAnchorEl(null);
    dispatch({ imageDiffResults: [], type: 'setImageDiffResults' });
  }, [dispatch]);

  const handleSuccessHide = useCallback(() => setSuccess(false), []);

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
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
          {success && <CheckCircle className={classes.successIcon} />}
          <Compare viewBox="1.5 -2 20 20" />

          {imageDiffResult.length > 0 && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClearAllResults}>
                Clear all results
              </MenuItem>
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
      </ClickAwayListener>
      <Snackbar
        variant="success"
        open={success}
        onClose={handleSuccessHide}
        autoHideDuration={null}
        message="All screen shot tests are passed successfully."
      />
      <ErrorSnackbar autoHideDuration={null} />
    </>
  );
};

ImageDiff.displayName = 'ImageDiff';

export { ImageDiff };
