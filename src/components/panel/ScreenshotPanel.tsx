import React from 'react';
import { useStorybookState } from '@storybook/api';
import { SCREENSHOT_PANEL_ID } from '../../constants';
import { ScreenshotMain } from '../screenshot-panel/ScreenshotMain';

const ScreenshotPanel: React.FC = () => {
  const state = useStorybookState();

  return (
    <ScreenshotMain showPanel={state.selectedPanel === SCREENSHOT_PANEL_ID} />
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
