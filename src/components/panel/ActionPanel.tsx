import React, { SFC, memo } from 'react';
import { ActionSetMain } from '../action-set';
import { ProviderWrapper } from './ProviderWrapper';
import { useStorybookState } from '@storybook/api';
import { ACTIONS_PANEL_ID } from '../../constants';

const ActionPanel: SFC = memo(() => {
  const state = useStorybookState();
  return (
    <ProviderWrapper>
      {state.selectedPanel === ACTIONS_PANEL_ID && <ActionSetMain />}
    </ProviderWrapper>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
