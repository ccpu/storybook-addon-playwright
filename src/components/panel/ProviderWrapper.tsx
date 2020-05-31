import React, { SFC } from 'react';
import { ThemeProvider } from '../common';

import { StateInspector } from 'reinspect';

const ProviderWrapper: SFC = (props) => {
  const { children } = props;

  return (
    <StateInspector>
      <ThemeProvider>{children}</ThemeProvider>
    </StateInspector>
  );
};

ProviderWrapper.displayName = 'ProviderWrapper';

export { ProviderWrapper };
