import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StateInspector } from 'reinspect';
import { createTrpcHttpClient, trpcClient } from '../../api/trpc/client';
import { ThemeProvider } from '../common';

const trpcHttpClient = createTrpcHttpClient();
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

const CommonProvider: React.FC = (props) => {
  const { children } = props;

  return (
    <trpcClient.Provider client={trpcHttpClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StateInspector>{children}</StateInspector>
        </ThemeProvider>
      </QueryClientProvider>
    </trpcClient.Provider>
  );
};

CommonProvider.displayName = 'CommonProvider';

export { CommonProvider };
