import React, { SFC } from 'react';
import { useStorybookState } from '@storybook/api';
import { SCREENSHOT_PANEL_ID } from '../../constants';
import { ScreenshotPanel as ScreenshotPanelComponent } from '../screenshot-panel';
import { ScreenshotProvider } from '../../store/screenshot';
import { CommonProvider } from '../common';

const ScreenshotPanel: SFC = () => {
  const state = useStorybookState();

  return (
    <CommonProvider>
      <ScreenshotProvider>
        {state.selectedPanel === SCREENSHOT_PANEL_ID && (
          <ScreenshotPanelComponent />
        )}
      </ScreenshotProvider>
    </CommonProvider>
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
