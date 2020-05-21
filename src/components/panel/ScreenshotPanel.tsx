import React, { SFC } from 'react';
import { ProviderWrapper } from './ProviderWrapper';
import { useStorybookState } from '@storybook/api';
import { SCREENSHOT_PANEL_ID } from '../../constants';
import { ScreenshotList } from '../screenshot-panel';
import { ScreenshotProvider } from '../../store/screenshot';

const ScreenshotPanel: SFC = () => {
  const state = useStorybookState();

  return (
    <ProviderWrapper>
      <ScreenshotProvider>
        {state.selectedPanel === SCREENSHOT_PANEL_ID && <ScreenshotList />}
      </ScreenshotProvider>
    </ProviderWrapper>
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
