import React, { SFC } from 'react';
import { Dialog, Snackbar } from '../common';
import { ImageDiff } from '../../api/typings';
import { Divider } from '@material-ui/core';

export interface ImageDiffDialogProps {
  result: ImageDiff;
  onClose: () => void;
}

const ImageDiffDialog: SFC<ImageDiffDialogProps> = (props) => {
  const { result, onClose } = props;

  if (!result || result.pass || result.added) return null;

  if (result.diffSize) {
    return (
      <Snackbar
        message={`Expected image to be the same size as the snapshot (${result.imageDimensions.baselineWidth}x${result.imageDimensions.baselineHeight}), but was different (${result.imageDimensions.receivedWidth}x${result.imageDimensions.receivedHeight}).\n`}
        open={true}
        onClose={onClose}
        type="error"
      />
    );
  }
  const differencePercentage = result.diffRatio * 100;
  const message = `Expected image to match or be a close match to snapshot but was ${differencePercentage}% different from snapshot (${result.diffPixelCount} differing pixels).\n`;

  return (
    <Dialog width="100%" open={true} onClose={onClose}>
      <p>{message}</p>
      <Divider />
      <img src={result.imgSrcString} />
    </Dialog>
  );
};

ImageDiffDialog.displayName = 'ImageDiffDialog';

export { ImageDiffDialog };
