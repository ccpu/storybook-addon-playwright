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

  if (!result) return null;

  if (result.added) {
    return (
      <Snackbar
        message={'Screenshot saved successfully.'}
        open={true}
        onClose={onClose}
        type="success"
        autoHideDuration={5000}
      />
    );
  }

  if (result.pass) {
    return (
      <Snackbar
        open={true}
        title={'Success'}
        autoHideDuration={5000}
        onClose={onClose}
        type="success"
      >
        <div>
          Testing existing screenshot were successful, no change has been
          detected.
        </div>
      </Snackbar>
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
