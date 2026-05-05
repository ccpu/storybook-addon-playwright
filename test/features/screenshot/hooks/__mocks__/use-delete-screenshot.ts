import { useDeleteScreenshot as orgUseDeleteScreenshot } from '../../../../../src/features/screenshot/hooks/use-delete-screenshot';

const useDeleteScreenshot = vi.fn<typeof orgUseDeleteScreenshot>();

useDeleteScreenshot.mockImplementation(() => {
  return {
    clearError: () => undefined,
    deleteScreenshot: async () => undefined,
    error: undefined,
    inProgress: false,
  } as unknown as ReturnType<typeof orgUseDeleteScreenshot>;
});

export { useDeleteScreenshot };
