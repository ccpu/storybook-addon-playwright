import React, { SFC, useCallback, useState } from 'react';
import { Menu, makeStyles, Badge, MenuItem } from '@material-ui/core';
import { IconButton } from '@storybook/components';
import Compare from '@material-ui/icons/Compare';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {
  useGlobalImageDiffResults,
  useScreenshotImageDiffResults,
  useGlobalScreenshotDispatch,
} from '../../hooks';
import { Loader, Snackbar } from '../common';
import { ImageDiffMenuItem } from './ImageDiffMenuItem';
import { useCurrentStoryData } from '../../hooks/use-current-story-data';
import { isStoryJsonFile } from '../../utils/is-story-json-file';

const useStyles = makeStyles(
  (theme) => {
    return {
      asterisk: {
        marginRight: -6,
        marginTop: -12,
      },
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
  testCurrentStory?: boolean;
}

const ImageDiff: SFC<ImageDiffStyleProps> = (props) => {
  const { testCurrentStory } = props;

  const classes = useStyles({ classes: props.classes });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [success, setSuccess] = useState(false);

  const { imageDiffResult } = useGlobalImageDiffResults();

  const storyInfo = useCurrentStoryData();

  const { dispatch } = useGlobalScreenshotDispatch();

  const {
    testStoryScreenShots,
    imageDiffTestInProgress,
    storyImageDiffError,
    clearImageDiffError,
  } = useScreenshotImageDiffResults();

  const diffResults = testCurrentStory
    ? imageDiffResult.filter((x) =>
        isStoryJsonFile(x.fileName, storyInfo.parameters.fileName),
      )
    : imageDiffResult;

  const handleImageDiffClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      //fixes menu close
      if (anchorEl) return;
      if (diffResults.length > 0) {
        setAnchorEl(event.currentTarget);
      } else {
        const result = await testStoryScreenShots(
          testCurrentStory ? storyInfo.parameters.fileName : undefined,
        );

        if (!(result instanceof Error))
          setSuccess(result && result.length === 0);
      }
    },
    [anchorEl, diffResults, storyInfo, testCurrentStory, testStoryScreenShots],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClearAllResults = useCallback(() => {
    setAnchorEl(null);
    if (testCurrentStory) {
      diffResults.forEach((sc) => {
        dispatch({
          screenshotId: sc.screenshotId,
          type: 'removeImageDiffResult',
        });
      });
    } else {
      dispatch({ imageDiffResults: [], type: 'setImageDiffResults' });
    }
  }, [dispatch, diffResults, testCurrentStory]);

  const handleSuccessHide = useCallback(() => setSuccess(false), []);

  if (!storyInfo) return null;

  const title = testCurrentStory
    ? `Run diff test for all stories in '${storyInfo.parameters.fileName}' file.`
    : 'Run diff test for all stories';

  return (
    <>
      <IconButton
        title={title}
        className={classes.button}
        onClick={handleImageDiffClick}
        style={{ position: 'relative' }}
        disabled={imageDiffTestInProgress}
      >
        <Badge
          badgeContent={diffResults.length}
          color="secondary"
          className={classes.imageDiffBadge}
        />

        {success && <CheckCircle className={classes.successIcon} />}
        <Compare viewBox="1.5 1 20 20" />
        {!testCurrentStory && <span className={classes.asterisk}>*</span>}
        {diffResults.length > 0 && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClearAllResults}>Clear results</MenuItem>
            {diffResults.map((diff) => (
              <ImageDiffMenuItem
                key={diff.storyId + diff.screenshotId}
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

      <Snackbar
        variant="error"
        open={storyImageDiffError !== undefined}
        onClose={clearImageDiffError}
        autoHideDuration={null}
        message={storyImageDiffError}
      />
      <Snackbar
        variant="success"
        open={success}
        onClose={handleSuccessHide}
        autoHideDuration={null}
        message="All screen shot tests are passed successfully."
      />
    </>
  );
};

ImageDiff.displayName = 'ImageDiff';

export { ImageDiff };
