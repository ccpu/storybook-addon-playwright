import React, { SFC } from 'react';
import { ImageDiffPreview } from './ImageDiffPreview';
import { Dialog, DialogProps } from './Dialog';
import { ImageDiffResult } from '../../api/typings';

export interface ImageDiffPreviewDialogProps extends DialogProps {
  imageDiffResult: ImageDiffResult;
}

const ImageDiffPreviewDialog: SFC<ImageDiffPreviewDialogProps> = (props) => {
  const { imageDiffResult, ...rest } = props;

  return (
    <Dialog width="100%" height="100%" {...rest}>
      <ImageDiffPreview imageDiffResult={imageDiffResult} />
    </Dialog>
  );
};

ImageDiffPreviewDialog.displayName = 'ImageDiffPreviewDialog';

export { ImageDiffPreviewDialog };
