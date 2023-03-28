import React from 'react';
import { IconButton } from '@storybook/components';
import { Tooltip } from '@material-ui/core';
import { useClipperState } from './Clipper';

const ClipperButton: React.FC = () => {
  const { clipping, toggleClippingState } = useClipperState();

  const handleClick = React.useCallback(() => {
    toggleClippingState();
  }, [toggleClippingState]);

  return (
    <IconButton active={clipping} onClick={handleClick}>
      <Tooltip
        placement="top"
        title={clipping ? 'Stop Clipping' : 'Start Clipping'}
      >
        <svg
          className="MuiSvgIcon-root"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          style={{
            height: 20,
            transform: 'rotate(180deg)',
            width: 20,
          }}
        >
          <path d="M17 5h-2V3h2v2zm-2 16h2v-2.59L19.59 21 21 19.59 18.41 17H21v-2h-6v6zm4-12h2V7h-2v2zm0 4h2v-2h-2v2zm-8 8h2v-2h-2v2zM7 5h2V3H7v2zM3 17h2v-2H3v2zm2 4v-2H3c0 1.1.9 2 2 2zM19 3v2h2c0-1.1-.9-2-2-2zm-8 2h2V3h-2v2zM3 9h2V7H3v2zm4 12h2v-2H7v2zm-4-8h2v-2H3v2zm0-8h2V3c-1.1 0-2 .9-2 2z"></path>
        </svg>
      </Tooltip>
    </IconButton>
  );
};

ClipperButton.displayName = 'ClipperButton';

export { ClipperButton };
