import type { StoryData } from '../../schema';
import type { ScreenshotTestTargetType } from '../../typings';
import { Badge } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IconButton, ListItem, WithTooltip } from '@storybook/components';
import { ContrastIcon } from '@storybook/icons';
import React, { useCallback } from 'react';
import {
  removeImageDiffResult,
  setImageDiffResults,
} from '../../features/screenshot/store/actions';
import {
  dismissImageDiffToasts,
  showImageDiffTestErrorToast,
  showImageDiffTestFinishedToast,
} from '../../features/screenshot/utils/image-diff-toast';
import { useGlobalImageDiffResults, useScreenshotDiffTestByType } from '../../hooks';
import { formatElapsedTime } from '../../utils';
import { isStoryJsonFile } from '../../utils/is-story-json-file';
import { Loader } from '../common';
import { ImageDiffMenuItem } from './ImageDiffMenuItem';

const useStyles = makeStyles(
  (theme) => {
    return {
      button: {
        overflow: 'visible !important',
      },
      imageDiffBadge: {
        '& span': {
          fontSize: '.6rem',
          height: 14,
          minWidth: 15,
          padding: '0 4px',
        },
        position: 'absolute',
        right: -2,
        top: 5,
        zIndex: 1,
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

  const { imageDiffResult } = useGlobalImageDiffResults();

  const { testStoryScreenShots, imageDiffTestInProgress } = useScreenshotDiffTestByType();

  const diffResults =
    target === 'file' && storyData
      ? imageDiffResult.filter((x) =>
          x.filePath ? isStoryJsonFile(x.filePath, storyData.filePath) : false,
        )
      : imageDiffResult;

  const failedDiffResults = diffResults.filter((x) => x.pass === false);

  const hasFailedDiff = failedDiffResults.length > 0;

  const handleImageDiffClick = useCallback(async () => {
    if (hasFailedDiff) return;

    dismissImageDiffToasts();

    const startedAt = Date.now();
    const result = await testStoryScreenShots(target);
    const elapsedTime = formatElapsedTime(Date.now() - startedAt);

    if (!Array.isArray(result)) {
      showImageDiffTestErrorToast(`Screenshot diff failed after ${elapsedTime}.`);
      return;
    }

    const imageDiffResults = result as Array<{ pass?: boolean }>;

    if (!imageDiffResults.find((x) => !x.pass)) {
      showImageDiffTestFinishedToast(
        `All screenshot tests passed successfully in ${elapsedTime}.`,
      );
    }
  }, [hasFailedDiff, target, testStoryScreenShots]);

  const handleClearAllResults = useCallback(() => {
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

  const iconButton = (
    <IconButton
      title={title}
      className={classes.button}
      onClick={handleImageDiffClick}
      style={{ position: 'relative' }}
      disabled={imageDiffTestInProgress}
    >
      {hasFailedDiff && (
        <Badge
          badgeContent={failedDiffResults.length}
          color="secondary"
          className={classes.imageDiffBadge}
          overlap="rectangular"
        />
      )}
      <ContrastIcon />

      <Loader position="absolute" open={imageDiffTestInProgress} progressSize={15} />
    </IconButton>
  );

  if (!hasFailedDiff) {
    return iconButton;
  }

  return (
    <WithTooltip
      closeOnOutsideClick
      placement="bottom"
      trigger="click"
      tooltip={({ onHide }) => (
        <div
          style={{
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ListItem
            title="Clear results"
            onClick={() => {
              handleClearAllResults();
              onHide();
            }}
          ></ListItem>

          {failedDiffResults
            .filter(
              (x, index, self) =>
                index === self.findIndex((t) => t.storyId === x.storyId),
            )
            .map((diff) => (
              <ImageDiffMenuItem
                key={`${diff.storyId || ''}${diff.screenshotId || ''}`}
                imageDiff={diff}
                onClick={onHide}
              />
            ))}
        </div>
      )}
    >
      {iconButton}
    </WithTooltip>
  );
};

ImageDiff.displayName = 'ImageDiff';

export { ImageDiff };
