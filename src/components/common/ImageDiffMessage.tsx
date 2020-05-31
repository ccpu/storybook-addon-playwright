import React, { SFC } from 'react';
import { Snackbar } from '../common';
import { ImageDiffResult } from '../../api/typings';
import { getImageDiffMessages } from '../../utils';
import { ImageDiffPreviewDialog } from './ImageDiffPreviewDialog';

export interface ImageDiffMessageProps {
  result: ImageDiffResult;
  onClose: () => void;
}

const ImageDiffMessage: SFC<ImageDiffMessageProps> = (props) => {
  const { result, onClose } = props;

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
    />
  );
};

ImageDiffMessage.displayName = 'ImageDiffMessage';

export { ImageDiffMessage };
