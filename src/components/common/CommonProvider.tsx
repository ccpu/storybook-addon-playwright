import React, { useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../common';
import { StateInspector } from 'reinspect';
import { SnackbarProvider } from 'notistack';
import { ToastContainer } from 'react-toastify';
import { createTrpcHttpClient, trpcClient } from '../../api';
import 'react-toastify/dist/ReactToastify.css';

const trpcHttpClient = createTrpcHttpClient();
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

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
    <trpcClient.Provider client={trpcHttpClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SnackbarProvider domRoot={div.current} preventDuplicate>
            <StateInspector>{children}</StateInspector>
            <ToastContainer position="bottom-right" />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpcClient.Provider>
  );
};

CommonProvider.displayName = 'CommonProvider';

export { CommonProvider };
