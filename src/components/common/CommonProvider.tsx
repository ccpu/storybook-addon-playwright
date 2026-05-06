import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../common';
import { StateInspector } from 'reinspect';
import { createTrpcHttpClient, trpcClient } from '../../api/trpc/client';

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
