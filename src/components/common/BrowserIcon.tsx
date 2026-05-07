import type { SvgIconProps } from '@material-ui/core';
import type { BrowserTypes } from '../../typings';
import React, { memo } from 'react';
import { Browser, Chrome, Firefox, Webkit } from '../../icons';

export interface BrowserIconProps extends SvgIconProps {
  browserType?: BrowserTypes;
}

const BrowserIcon: React.FC<BrowserIconProps> = memo((props) => {
  const { browserType, ...rest } = props;

  switch (browserType) {
    case 'chromium':
      return <Chrome {...rest} />;
    case 'firefox':
      return <Firefox {...rest} />;
    case 'webkit':
      return <Webkit {...rest} />;
    default:
      return <Browser {...rest} />;
  }
});

BrowserIcon.displayName = 'BrowserIcon';

export { BrowserIcon };
