import React, { SFC } from 'react';
import { ProviderWrapper } from './ProviderWrapper';

export interface ScreenshotPanelProps {
  active?: boolean;
}

const ScreenshotPanel: SFC<ScreenshotPanelProps> = (props) => {
  const { active } = props;

  if (!active) return null;

  return <ProviderWrapper>hi</ProviderWrapper>;
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
