import React, { SFC, useCallback } from 'react';
import { BrowserTypes } from '../../typings';
import { Firefox, Browser, Chrome, Webkit } from '../../icons';
import { IconButton } from '@storybook/components';

export interface BrowserIconProps {
  browserType: BrowserTypes;
  onClick: (browserType: BrowserTypes) => void;
  active: boolean;
}

const BrowserIcon: SFC<{ browserType?: string }> = (props) => {
  switch (props.browserType) {
    case 'chromium':
      return <Chrome />;
    case 'firefox':
      return <Firefox />;
    case 'webkit':
      return <Webkit />;
    default:
      return <Browser />;
  }
};
BrowserIcon.displayName = 'BrowserIcon';

const BrowserIconButton: SFC<BrowserIconProps> = (props) => {
  const { browserType, onClick, active } = props;

  const handleClick = useCallback(() => {
    onClick(browserType);
  }, [browserType, onClick]);

  return (
    <IconButton onClick={handleClick} active={active}>
      <BrowserIcon browserType={browserType} />
    </IconButton>
  );
};

BrowserIconButton.displayName = 'BrowserIconButton';

export { BrowserIconButton, BrowserIcon };
