import React, { useRef, useEffect } from 'react';
import { ThemeProvider } from '../common';
import { StateInspector } from 'reinspect';
import { SnackbarProvider } from 'notistack';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CommonProvider: React.FC = (props) => {
  const { children } = props;

  const div = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    const elm = div.current;
    document.body.appendChild(elm);
    return () => {
      document.body.removeChild(elm);
    };
  }, []);

  return (
    <ThemeProvider>
      <SnackbarProvider domRoot={div.current} preventDuplicate>
        <StateInspector>{children}</StateInspector>
        <ToastContainer position="bottom-right" />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

CommonProvider.displayName = 'CommonProvider';

export { CommonProvider };
