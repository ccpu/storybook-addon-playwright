import React, { SFC } from 'react';
import { Dialog, DialogProps } from './Dialog';
import { Divider } from '@material-ui/core';
import { ScreenshotPreview } from './ScreenshotPreview';

export interface ScreenShotDialogProps extends DialogProps {
  title?: string;
  onClose: () => void;
  imgSrcString: string;
}

const ScreenShotDialog: SFC<ScreenShotDialogProps> = (props) => {
  const { title, onClose, imgSrcString, ...rest } = props;

  return (
    <Dialog width="100%" open={true} onClose={onClose} {...rest}>
      <p style={{ paddingLeft: 20 }}>{title}</p>
      <Divider />
      <ScreenshotPreview imgSrcString={imgSrcString} />
    </Dialog>
  );
};

ScreenShotDialog.displayName = 'ScreenShotDialog';

export { ScreenShotDialog };
