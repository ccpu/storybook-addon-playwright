type ToastApi = {
  dismiss: (
    ...args: Parameters<typeof import('react-toastify').toast.dismiss>
  ) => ReturnType<typeof import('react-toastify').toast.dismiss>;
  error: (
    ...args: Parameters<typeof import('react-toastify').toast.error>
  ) => ReturnType<typeof import('react-toastify').toast.error>;
  info: (
    ...args: Parameters<typeof import('react-toastify').toast.info>
  ) => ReturnType<typeof import('react-toastify').toast.info>;
  loading: (
    ...args: Parameters<typeof import('react-toastify').toast.loading>
  ) => ReturnType<typeof import('react-toastify').toast.loading>;
  success: (
    ...args: Parameters<typeof import('react-toastify').toast.success>
  ) => ReturnType<typeof import('react-toastify').toast.success>;
  warn: (
    ...args: Parameters<typeof import('react-toastify').toast.warn>
  ) => ReturnType<typeof import('react-toastify').toast.warn>;
};

export const toast: ToastApi = {
  dismiss: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
  success: vi.fn(),
  warn: vi.fn(),
};

export const ToastContainer = () => null;
