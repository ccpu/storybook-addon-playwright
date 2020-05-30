import React, { SFC, useCallback, useState } from 'react';
import { ImageDiffResult } from '../../api/typings';
import { Divider, makeStyles, Tabs, Tab } from '@material-ui/core';
import { ImagePreview } from './ImagePreview';
import { Alert } from '@material-ui/lab';
import { getImageDiffMessages } from '../../utils';

const useStyles = makeStyles(
  () => {
    return {
      preview: {
        flexGrow: 1,
        overflow: 'auto',
      },
      root: {
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        overflow: 'hidden',
        padding: 5,
        position: 'relative',
        width: '100%',
      },
    };
  },
  { name: 'ImageDiffPreview' },
);
export { useStyles as useImageDiffPreviewStyles };

export interface ImageDiffPreviewProps {
  imageDiffResult: ImageDiffResult;
}

const ImageDiffPreview: SFC<ImageDiffPreviewProps> = (props) => {
  const { imageDiffResult } = props;

  const [value, setValue] = React.useState(0);

  const [showDiff, setShowDiff] = useState(false);

  const classes = useStyles();

  const currentImage =
    imageDiffResult.pass || !showDiff
      ? imageDiffResult.newScreenshot
      : imageDiffResult.imgSrcString;

  const error = getImageDiffMessages(imageDiffResult);

  const toggleScreenshotDiff = useCallback(
    (_event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      setShowDiff(!showDiff);
    },
    [showDiff],
  );

  return (
    <div className={classes.root}>
      {error && <Alert severity="error">{error}</Alert>}
      {!imageDiffResult.pass && (
        <Tabs value={value} variant="fullWidth" onChange={toggleScreenshotDiff}>
          <Tab label="New screen shot" />
          <Tab label="Screenshot image diff" />
        </Tabs>
      )}
      <Divider />
      <div className={classes.preview}>
        <ImagePreview imgSrcString={currentImage} />
      </div>
    </div>
  );
};

ImageDiffPreview.displayName = 'ImageDiffPreview';

export { ImageDiffPreview };
