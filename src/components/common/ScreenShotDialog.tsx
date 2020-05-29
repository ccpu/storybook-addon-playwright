import React, { SFC } from 'react';
import { Dialog, DialogProps } from './Dialog';
import { Divider } from '@material-ui/core';
import { MapInteractionCSS } from 'react-map-interaction';
import { useKeyPress } from '../../hooks';

export interface ScreenShotDialogProps extends DialogProps {
  title?: string;
  onClose: () => void;
  imgSrcString: string;
}

const ScreenShotDialog: SFC<ScreenShotDialogProps> = (props) => {
  const { title, onClose, imgSrcString, ...rest } = props;

  const isPressed = useKeyPress('Control');

  return (
    <Dialog width="100%" open={true} onClose={onClose} {...rest}>
      <p style={{ paddingLeft: 20 }}>{title}</p>
      <Divider />
      <MapInteractionCSS defaultScale={1} disableZoom={!isPressed}>
        <img src={imgSrcString} />
      </MapInteractionCSS>
    </Dialog>
  );
};

ScreenShotDialog.displayName = 'ScreenShotDialog';

export { ScreenShotDialog };
