import React, { SFC } from 'react';
import { Snackbar } from '../common';
import { ImageDiffResult } from '../../api/typings';
import { getImageDiffMessages } from '../../utils';
import {
  ImageDiffPreviewDialog,
  ImageDiffPreviewDialogProps,
} from './ImageDiffPreviewDialog';
import { BrowserTypes } from '../../typings';

export interface ImageDiffMessageProps
  extends Partial<ImageDiffPreviewDialogProps> {
  result: ImageDiffResult;
  onClose: () => void;
  title?: string;
  browserType?: BrowserTypes;
}

const ImageDiffMessage: SFC<ImageDiffMessageProps> = (props) => {
  const { title, result, onClose, browserType, ...rest } = props;

  if (!result) return null;

  const titleMsg = title || result.oldScreenShotTitle;
  if (result.added) {
    return (
      <Snackbar
        variant="success"
        // prettier-ignore
        message={`Screenshot ${(titleMsg? `'${titleMsg}'`:'') + `${(browserType ? ` for '${browserType}'` : '')}`} saved successfully.`}
        open={true}
        onClose={onClose}
        autoHideDuration={5000}
      />
    );
  }

  if (result.pass) {
    return (
      <Snackbar
        open={true}
        autoHideDuration={5000}
        onClose={onClose}
        variant="success"
        message={`Testing existing screenshot were successful,
        no change has been detected.${titleMsg ? `\nTitle: ${titleMsg}` : ''}${
          browserType ? `\nBrowser: ` + browserType : ''
        }`}
      />
    );
  }

  if (result.diffSize) {
    return (
      <Snackbar
        message={getImageDiffMessages(result)}
        open={true}
        onClose={onClose}
        variant="error"
      />
    );
  }

  return (
    <ImageDiffPreviewDialog
      imageDiffResult={result}
      onClose={onClose}
      open={true}
      activeTab="imageDiff"
      title={titleMsg}
      {...rest}
    />
  );
};

ImageDiffMessage.displayName = 'ImageDiffMessage';

export { ImageDiffMessage };
