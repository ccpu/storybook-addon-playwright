import React, { SFC } from 'react';
import { Dialog, Snackbar } from '../common';
import { ImageDiffResult } from '../../api/typings';
import { Divider } from '@material-ui/core';
import { getImageDiffMessages } from '../../utils';
import { MapInteractionCSS } from 'react-map-interaction';
import { useKeyPress } from '../../hooks';

export interface ImageDiffMessageProps {
  result: ImageDiffResult;
  onClose: () => void;
}

const ImageDiffMessage: SFC<ImageDiffMessageProps> = (props) => {
  const { result, onClose } = props;
  const isPressed = useKeyPress('Control');

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
    <Dialog width="100%" open={true} onClose={onClose}>
      <p style={{ paddingLeft: 20 }}>{getImageDiffMessages(result)}</p>
      <Divider />
      <MapInteractionCSS defaultScale={1} disableZoom={!isPressed}>
        <img src={result.imgSrcString} />
      </MapInteractionCSS>
    </Dialog>
  );
};

ImageDiffMessage.displayName = 'ImageDiffMessage';

export { ImageDiffMessage };
