import React, { SFC } from 'react';
import { ImageDiffResult } from '../../api/typings';
import { getImageDiffMessages } from '../../utils';
import {
  ImageDiffPreviewDialog,
  ImageDiffPreviewDialogProps,
} from './ImageDiffPreviewDialog';
import { BrowserTypes } from '../../typings';
import { useSnackbar } from '../../hooks/use-snackbar';

export interface ImageDiffMessageProps
  extends Partial<ImageDiffPreviewDialogProps> {
  result: ImageDiffResult;
  onClose: () => void;
  title?: string;
  browserType?: BrowserTypes;
}

const ImageDiffMessage: SFC<ImageDiffMessageProps> = (props) => {
  const { title, result, onClose, browserType, ...rest } = props;

  const { openSnackbar } = useSnackbar();

  const titleMsg = title || (result && result.oldScreenShotTitle);

  React.useEffect(() => {
    if (!result) return;

    if (result.added) {
      openSnackbar(
        // prettier-ignore
        `Screenshot ${ `${browserType ? ` for '${browserType}'` : ''}` } saved successfully.`,
        { autoHideDuration: 5000, onClose },
      );
    }
  }, [browserType, onClose, openSnackbar, result]);

  React.useEffect(() => {
    if (!result) return;

    if (result.pass) {
      openSnackbar(
        // prettier-ignore
        `Testing existing screenshot were successful, no change has been detected.${titleMsg ? `\nTitle: ${titleMsg}` : ''}${browserType ? `\nBrowser: ` + browserType : '' }`,
        { autoHideDuration: 5000, onClose },
      );
      return;
    }

    if (result.diffSize || result.error) {
      openSnackbar(getImageDiffMessages(result), {
        autoHideDuration: 0,
        onClose,
      });
      return;
    }
  }, [browserType, onClose, openSnackbar, result, titleMsg]);

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
