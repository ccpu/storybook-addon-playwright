import { useStorybookState } from '@storybook/manager-api';
import React from 'react';
import { SCREENSHOT_PANEL_ID } from '../../constants';
import { ScreenshotMain } from '../../features/screenshot/components/screenshot-panel/ScreenshotMain';

const ScreenshotPanel: React.FC = () => {
  const state = useStorybookState();
  return (
    <ScreenshotMain showPanel={state.selectedPanel === SCREENSHOT_PANEL_ID} />
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
