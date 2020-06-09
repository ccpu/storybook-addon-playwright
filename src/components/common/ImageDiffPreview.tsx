import React, { SFC, useCallback } from 'react';
import { ImageDiffResult } from '../../api/typings';
import { makeStyles, Tabs, Tab, Divider } from '@material-ui/core';
import { ImagePreview } from './ImagePreview';
import { Alert } from '@material-ui/lab';
import { getImageDiffMessages } from '../../utils';

const useStyles = makeStyles(
  () => {
    return {
      preview: {
        flexGrow: 1,
        margin: 5,
        overflow: 'auto',
      },
      root: {
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        overflow: 'hidden',
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
  activeTab?: 'newScreenshot' | 'imageDiff';
}

const ImageDiffPreview: SFC<ImageDiffPreviewProps> = (props) => {
  const { imageDiffResult, activeTab } = props;

  const [value, setValue] = React.useState(activeTab === 'imageDiff' ? 1 : 0);

  const [showDiff, setShowDiff] = React.useState(activeTab === 'imageDiff');

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
      {!imageDiffResult.pass && (
        <>
          <Tabs
            textColor="primary"
            value={value}
            variant="fullWidth"
            onChange={toggleScreenshotDiff}
            indicatorColor="primary"
          >
            <Tab label="New screen shot" />
            <Tab label="Screenshot image diff" />
          </Tabs>
          <Divider />
        </>
      )}
      {error && value === 1 && <Alert severity="error">{error}</Alert>}
      <div className={classes.preview}>
        <ImagePreview imgSrcString={currentImage} />
      </div>
    </div>
  );
};

ImageDiffPreview.displayName = 'ImageDiffPreview';

export { ImageDiffPreview };
