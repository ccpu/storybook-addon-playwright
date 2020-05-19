import React, { SFC } from 'react';
import { ThemeProvider } from '../common';
import { ActionProvider } from '../../store';
import { StateInspector } from 'reinspect';

const ProviderWrapper: SFC = (props) => {
  const { children } = props;

  return (
    <StateInspector>
      <ActionProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ActionProvider>
    </StateInspector>
  );
};

ProviderWrapper.displayName = 'ProviderWrapper';

export { ProviderWrapper };
