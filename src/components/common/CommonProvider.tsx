import React, { SFC } from 'react';
import { ThemeProvider } from '../common';
import { StateInspector } from 'reinspect';
import { SnackbarProvider } from 'notistack';

const CommonProvider: SFC = (props) => {
  const { children } = props;

  return (
    <StateInspector>
      <ThemeProvider>
        <SnackbarProvider
          domRoot={document.getElementById('react-notification')}
          preventDuplicate
        >
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </StateInspector>
  );
};

CommonProvider.displayName = 'CommonProvider';

export { CommonProvider };
