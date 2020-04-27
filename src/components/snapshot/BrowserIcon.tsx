import React, { SFC, useCallback } from 'react';
import { BrowserTypes } from '../../typings';
import { Firefox, Browser, Chrome, Webkit } from '../../icons';
import { IconButton } from '@storybook/components';

export interface BrowserIconProps {
  browserType: BrowserTypes;
  onClick: (browserType: BrowserTypes) => void;
  active: boolean;
}

const BrowserIcon: SFC<BrowserIconProps> = (props) => {
  const { browserType, onClick, active } = props;

  const handleClick = useCallback(() => {
    onClick(browserType);
  }, [browserType, onClick]);

  const Icon = () => {
    switch (browserType) {
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

  return (
    <IconButton onClick={handleClick} active={active}>
      <Icon />
    </IconButton>
  );
};

BrowserIcon.displayName = 'BrowserIcon';

export { BrowserIcon };
