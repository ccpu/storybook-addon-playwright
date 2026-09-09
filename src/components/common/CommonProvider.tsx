import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NiceModal from '@ebay/nice-modal-react';
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

const StateInspectorWithChildren = StateInspector as React.FC<
  React.PropsWithChildren<React.ComponentProps<typeof StateInspector>>
>;

const CommonProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <trpcClient.Provider client={trpcHttpClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NiceModal.Provider>
            <StateInspectorWithChildren>{children}</StateInspectorWithChildren>
          </NiceModal.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpcClient.Provider>
  );
};

CommonProvider.displayName = 'CommonProvider';

export { CommonProvider };
