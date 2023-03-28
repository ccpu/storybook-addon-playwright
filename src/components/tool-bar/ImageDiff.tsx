import React, { useCallback } from 'react';
import { Menu, makeStyles, Badge, MenuItem } from '@material-ui/core';
import { IconButton } from '@storybook/components';
import Compare from '@material-ui/icons/Compare';
import {
  useGlobalImageDiffResults,
  useScreenshotImageDiffResults,
  useSnackbar,
  useGlobalScreenshotDispatch,
} from '../../hooks';
import { Loader } from '../common';
import { ImageDiffMenuItem } from './ImageDiffMenuItem';
import { isStoryJsonFile } from '../../utils/is-story-json-file';
import { ScreenshotTestTargetType, StoryData } from '../../typings';

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
  target: ScreenshotTestTargetType;
  storyData: StoryData;
}

const ImageDiff: React.FC<ImageDiffStyleProps> = (props) => {
  const { target, storyData } = props;

  const classes = useStyles({ classes: props.classes });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { imageDiffResult } = useGlobalImageDiffResults();

  const { dispatch } = useGlobalScreenshotDispatch();

  const { openSnackbar } = useSnackbar();

  const { testStoryScreenShots, imageDiffTestInProgress, clearImageDiffError } =
    useScreenshotImageDiffResults();

  const diffResults =
    target === 'file'
      ? imageDiffResult.filter((x) =>
          isStoryJsonFile(x.fileName, storyData.parameters.fileName),
        )
      : imageDiffResult;

  const handleImageDiffClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      //fixes menu close
      if (anchorEl) return;
      if (diffResults.length > 0) {
        setAnchorEl(event.currentTarget);
      } else {
        const result = await testStoryScreenShots(target);
        if (result instanceof Error) {
          openSnackbar(result.message, {
            autoHideDuration: null,
            variant: 'error',
          });
          return;
        }

        if (result && !result.find((x) => !x.pass)) {
          openSnackbar('All screenshot tests are passed successfully.', {
            autoHideDuration: null,
            onClose: clearImageDiffError,
          });
        }
      }
    },
    [
      anchorEl,
      clearImageDiffError,
      diffResults.length,
      openSnackbar,
      target,
      testStoryScreenShots,
    ],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClearAllResults = useCallback(() => {
    setAnchorEl(null);
    if (target === 'file') {
      diffResults.forEach((sc) => {
        dispatch({
          screenshotId: sc.screenshotId,
          type: 'removeImageDiffResult',
        });
      });
    } else {
      dispatch({ imageDiffResults: [], type: 'setImageDiffResults' });
    }
  }, [dispatch, diffResults, target]);

  const title =
    target === 'file'
      ? `Run diff test for all stories in '${storyData.parameters.fileName}' file.`
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
          overlap="rectangular"
        />

        <Compare viewBox="1.5 1 20 20" />

        {diffResults.length > 0 && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClearAllResults}>Clear results</MenuItem>
            {diffResults
              .filter(
                (x, index, self) =>
                  index === self.findIndex((t) => t.storyId === x.storyId),
              )
              .map((diff) => (
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
    </>
  );
};

ImageDiff.displayName = 'ImageDiff';

export { ImageDiff };
