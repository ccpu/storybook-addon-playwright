import React, { useCallback } from 'react';
import { makeStyles, Badge } from '@material-ui/core';
import { IconButton, ListItem, WithTooltip } from '@storybook/components';
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
import { ContrastIcon } from '@storybook/icons';

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

  const { testStoryScreenShots, imageDiffTestInProgress } =
    useScreenshotDiffTestByType();

  const diffResults =
    target === 'file' && storyData
      ? imageDiffResult.filter((x) =>
          x.filePath ? isStoryJsonFile(x.filePath, storyData.filePath) : false,
        )
      : imageDiffResult;

  const handleImageDiffClick = useCallback(async () => {
    if (diffResults.length > 0) return;

    const result = await testStoryScreenShots(target);

    if (!Array.isArray(result)) return;

    const imageDiffResults = result as Array<{ pass?: boolean }>;

    if (!imageDiffResults.find((x) => !x.pass)) {
      toast.success('All screenshot tests are passed successfully.', {
        id: 'image-diff:all-passed',
      });
    }
  }, [diffResults.length, target, testStoryScreenShots]);

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

  const hasFailedDiff =
    diffResults.length > 0 && diffResults.some((x) => x.pass === false);

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
          badgeContent={diffResults.length}
          color="secondary"
          className={classes.imageDiffBadge}
          overlap="rectangular"
        />
      )}
      <ContrastIcon />

      <Loader
        position="absolute"
        open={imageDiffTestInProgress}
        progressSize={15}
      />
    </IconButton>
  );

  if (diffResults.length === 0) {
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

          {diffResults
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
