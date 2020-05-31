import React, { SFC } from 'react';
import { Snackbar } from '../common';
import { ImageDiffResult } from '../../api/typings';
import { getImageDiffMessages } from '../../utils';
import {
  ImageDiffPreviewDialog,
  ImageDiffPreviewDialogProps,
} from './ImageDiffPreviewDialog';

export interface ImageDiffMessageProps
  extends Partial<ImageDiffPreviewDialogProps> {
  result: ImageDiffResult;
  onClose: () => void;
  title?: string;
}

const ImageDiffMessage: SFC<ImageDiffMessageProps> = (props) => {
  const { title, result, onClose, ...rest } = props;

  if (!result || result.added) return null;

  if (result.pass) {
    return (
      <Snackbar
        open={true}
        title={'Success'}
        message="No change has been detected."
        autoHideDuration={3000}
        onClose={onClose}
        type="success"
      />
    );
  }

  if (result.diffSize) {
    return (
      <Snackbar
        message={getImageDiffMessages(result)}
        open={true}
        onClose={onClose}
        type="error"
      />
    );
  }

  return (
    <ImageDiffPreviewDialog
      imageDiffResult={result}
      onClose={onClose}
      open={true}
      activeTab="imageDiff"
      title={title}
      {...rest}
    />
  );
};

ImageDiffMessage.displayName = 'ImageDiffMessage';

export { ImageDiffMessage };
