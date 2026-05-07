import type { BrowserTypes } from '../../typings';
import { capitalize } from '@material-ui/core';
import { IconButton } from '@storybook/components';
import React, { useCallback } from 'react';
import { BrowserIcon } from '../common/BrowserIcon';

export interface BrowserIconProps {
  browserType: BrowserTypes;
  onClick: (browserType: BrowserTypes) => void;
  active: boolean;
}

const BrowserIconButton: React.FC<BrowserIconProps> = (props) => {
  const { browserType, onClick, active } = props;

  const handleClick = useCallback(() => {
    onClick(browserType);
  }, [browserType, onClick]);

  return (
    <IconButton
      onClick={handleClick}
      active={active}
      title={capitalize(browserType)}
    >
      <BrowserIcon browserType={browserType} />
    </IconButton>
  );
};

BrowserIconButton.displayName = 'BrowserIconButton';

export { BrowserIconButton };
