import React, { useCallback } from 'react';
import { Menu, makeStyles, Badge, MenuItem } from '@material-ui/core';
import { IconButton } from '@storybook/components';
import Compare from '@material-ui/icons/Compare';
import {
  useGlobalImageDiffResults,
  useScreenshotDiffTestByType,
} from '../../hooks';
import {
  removeImageDiffResult,
  setImageDiffResults,
} from '../../features/screenshot/store/actions';
import { Loader } from '../common';
import { ImageDiffMenuItem } from './ImageDiffMenuItem';
import { isStoryJsonFile } from '../../utils/is-story-json-file';
import { ScreenshotTestTargetType } from '../../typings';
import { StoryData } from '../../schema';
import { toast } from '../../utils/toast';

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
  storyData?: StoryData;
}

const ImageDiff: React.FC<ImageDiffStyleProps> = (props) => {
  const { target, storyData } = props;

  const classes = useStyles({ classes: props.classes });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { imageDiffResult } = useGlobalImageDiffResults();

  const { testStoryScreenShots, imageDiffTestInProgress } =
    useScreenshotDiffTestByType();

  const diffResults =
    target === 'file' && storyData
      ? imageDiffResult.filter((x) =>
          x.filePath ? isStoryJsonFile(x.filePath, storyData.filePath) : false,
        )
      : imageDiffResult;

  const handleImageDiffClick = useCallback(
    async (event: React.SyntheticEvent) => {
      //fixes menu close
      if (anchorEl) return;
      if (diffResults.length > 0) {
        setAnchorEl(event.currentTarget as HTMLElement);
      } else {
        const result = await testStoryScreenShots(target);

        if (!Array.isArray(result)) return;

        const imageDiffResults = result as Array<{ pass?: boolean }>;

        if (!imageDiffResults.find((x) => !x.pass)) {
          toast.success('All screenshot tests are passed successfully.', {
            autoClose: false,
            toastId: 'image-diff:all-passed',
          });
        }
      }
    },
    [anchorEl, diffResults.length, target, testStoryScreenShots],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClearAllResults = useCallback(() => {
    setAnchorEl(null);
    if (target === 'file') {
      diffResults.forEach((sc) => {
        if (sc.screenshotId) {
          removeImageDiffResult(sc.screenshotId);
        }
      });
    } else {
      setImageDiffResults([]);
    }
  }, [diffResults, target]);

  const title =
    target === 'file' && storyData
      ? `Run diff test for all stories in '${storyData.filePath}' file.`
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
                  key={`${diff.storyId || ''}${diff.screenshotId || ''}`}
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
