vi.mock('../../../src/api/trpc/client', async () => {
  const { fixScreenshotFileName } = await import(
    '../../api/trpc/clients/__mocks__/fix-title.client'
  );
  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      fixTitle: {
        fixScreenshotFileName: {
          useMutation: () => ({
            data: undefined,
            isPending: false,
            mutate: (input: unknown) => {
              void fixScreenshotFileName(input as never);
            },
            mutateAsync: (input: unknown) =>
              fixScreenshotFileName(input as never),
            reset: vi.fn(),
          }),
        },
      },
    },
  };
});
import React from 'react';
import { shallow } from 'enzyme';
import { FixScreenshotFileDialog } from '../../../src/components/common/FixScreenshotFileDialog';

describe('FixScreenshotFileDialog', () => {
  it('should be defined', () => {
    const wrapper = shallow(
      <FixScreenshotFileDialog onClose={() => undefined} open={true} />,
    );

    expect(wrapper).toBeDefined();
  });
});
