import React from 'react';
import { ImageDiffPreview, ImageDiffPreviewProps } from './ImageDiffPreview';
import { Dialog, DialogProps } from './Dialog';

export interface ImageDiffPreviewDialogProps
  extends DialogProps,
    ImageDiffPreviewProps {}

const ImageDiffPreviewDialog: React.FC<ImageDiffPreviewDialogProps> = (
  props,
) => {
  const { imageDiffResult, activeTab, ...rest } = props;

  return (
    <Dialog width="100%" height="100%" {...rest}>
      <ImageDiffPreview
        imageDiffResult={imageDiffResult}
        activeTab={activeTab}
      />
    </Dialog>
  );
};

ImageDiffPreviewDialog.displayName = 'ImageDiffPreviewDialog';

export { ImageDiffPreviewDialog };
