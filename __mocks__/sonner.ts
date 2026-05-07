import { vi } from 'vitest';

let toastId = 0;

const createToastMock = () =>
  Object.assign(
    vi.fn(() => ++toastId),
    {
      custom: vi.fn(() => ++toastId),
      dismiss: vi.fn(),
      error: vi.fn(() => ++toastId),
      info: vi.fn(() => ++toastId),
      loading: vi.fn(() => ++toastId),
      message: vi.fn(() => ++toastId),
      promise: vi.fn(() => ++toastId),
      success: vi.fn(() => ++toastId),
      warning: vi.fn(() => ++toastId),
    },
  );

export const toast = createToastMock() as unknown as typeof import('sonner').toast;

export const Toaster = () => null;

export const useSonner = vi.fn(() => ({ toasts: [] }));
