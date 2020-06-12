import React, { SFC, useCallback } from 'react';
import { BrowserTypes } from '../../typings';
import { IconButton } from '@storybook/components';
import { BrowserIcon } from '../common/BrowserIcon';
import { Tooltip, capitalize } from '@material-ui/core';

export interface BrowserIconProps {
  browserType: BrowserTypes;
  onClick: (browserType: BrowserTypes) => void;
  active: boolean;
}

const BrowserIconButton: SFC<BrowserIconProps> = (props) => {
  const { browserType, onClick, active } = props;

  const handleClick = useCallback(() => {
    onClick(browserType);
  }, [browserType, onClick]);

  return (
    <Tooltip placement="top" title={capitalize(browserType)}>
      <IconButton onClick={handleClick} active={active}>
        <BrowserIcon browserType={browserType} />
      </IconButton>
    </Tooltip>
  );
};

BrowserIconButton.displayName = 'BrowserIconButton';

export { BrowserIconButton };
