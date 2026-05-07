import React from 'react';
import { toast } from '../../src/utils/toast/toast';
import { toast as sonnerToast } from 'sonner';

describe('toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes dismiss into custom toast render callbacks', () => {
    const renderCustomToast = vi.fn(({ dismiss }) => (
      <div onClick={dismiss}>custom</div>
    ));

    const toastId = toast.custom(renderCustomToast, { id: 123 });

    const renderToast = vi.mocked(sonnerToast.custom).mock.calls[0][0];
    const renderedToast = renderToast(123);

    expect(toastId).toBe(1);
    expect(renderCustomToast).toHaveBeenCalledWith(
      expect.objectContaining({
        dismiss: expect.any(Function),
        id: 123,
      }),
    );
    expect(renderedToast.props.onClick).toEqual(expect.any(Function));

    renderedToast.props.onClick();

    expect(sonnerToast.custom).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        duration: 10_000,
        id: 123,
      }),
    );
    expect(sonnerToast.dismiss).toHaveBeenCalledWith(123);
  });
});
