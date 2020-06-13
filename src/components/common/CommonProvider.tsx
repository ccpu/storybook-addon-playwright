import React, { SFC, useRef, useEffect } from 'react';
import { ThemeProvider } from '../common';
import { StateInspector } from 'reinspect';
import { SnackbarProvider } from 'notistack';

const CommonProvider: SFC = (props) => {
  const { children } = props;

  const div = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(div.current);
    return () => {
      document.body.removeChild(div.current);
    };
  }, []);

  return (
    <StateInspector>
      <ThemeProvider>
        <SnackbarProvider domRoot={div.current} preventDuplicate>
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </StateInspector>
  );
};

CommonProvider.displayName = 'CommonProvider';

export { CommonProvider };
