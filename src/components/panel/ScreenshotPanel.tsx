import React from 'react';
import { useStorybookState } from '@storybook/manager-api';
import { ScreenshotMain } from '../screenshot-panel/ScreenshotMain';
import { SCREENSHOT_PANEL_ID } from '../../constants';

const ScreenshotPanel: React.FC = () => {
  const state = useStorybookState();
  return (
    <ScreenshotMain showPanel={state.selectedPanel === SCREENSHOT_PANEL_ID} />
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
