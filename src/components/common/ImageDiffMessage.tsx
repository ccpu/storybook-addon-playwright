import React from 'react';
import { ImageDiffResult } from '../../api/typings';
import { getImageDiffMessages } from '../../utils';
import {
  ImageDiffPreviewDialog,
  ImageDiffPreviewDialogProps,
} from './ImageDiffPreviewDialog';
import { BrowserTypes } from '../../typings';
import { toast } from '../../utils/toast';

export interface ImageDiffMessageProps
  extends Partial<ImageDiffPreviewDialogProps> {
  result?: ImageDiffResult;
  onClose: () => void;
  title?: string;
  browserType?: BrowserTypes;
}

const ImageDiffMessage: React.FC<ImageDiffMessageProps> = (props) => {
  const { title, result, onClose, browserType, ...rest } = props;

  const titleMsg = title || (result && result.oldScreenShotTitle);

  React.useEffect(() => {
    if (!result) return;

    if (result.added) {
      toast.success(
        // prettier-ignore
        `Screenshot ${ `${browserType ? ` for '${browserType}'` : ''}` } saved successfully.`,
        {
          duration: 5000,
          onAutoClose: onClose,
          onDismiss: onClose,
        },
      );
    }
  }, [browserType, onClose, result]);

  React.useEffect(() => {
    if (!result) return;

    if (result.pass) {
      toast.success(
        // prettier-ignore
        `Testing existing screenshot were successful, no change has been detected.${titleMsg ? `\nTitle: ${titleMsg}` : ''}${browserType ? `\nBrowser: ` + browserType : '' }`,
        {
          duration: 5000,
          onAutoClose: onClose,
          onDismiss: onClose,
        },
      );
      return;
    }

    if (result.diffSize || result.error) {
      toast.error(getImageDiffMessages(result), {
        duration: Infinity,
        onDismiss: onClose,
      });
      return;
    }
  }, [browserType, onClose, result, titleMsg]);

  if (!result || result.pass || result.added || result.diffSize || result.error)
    return null;

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

const MemoizedImageDiffMessage = React.memo(ImageDiffMessage);
export { ImageDiffMessage, MemoizedImageDiffMessage };
