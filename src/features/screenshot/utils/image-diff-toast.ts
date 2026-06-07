import { toast } from '../../../utils/toast';

const IMAGE_DIFF_TOAST_DURATION = 120000; // 2 minutes

let testFinishedToastId: string | number | undefined;
let testErrorToastId: string | number | undefined;
let updateFinishedToastId: string | number | undefined;

function dismissToast(toastId: string | number | undefined) {
  if (!toastId) return;

  toast.dismiss(toastId);
}

export function dismissImageDiffToasts() {
  dismissToast(testFinishedToastId);
  dismissToast(testErrorToastId);
  dismissToast(updateFinishedToastId);
  testFinishedToastId = undefined;
  testErrorToastId = undefined;
  updateFinishedToastId = undefined;
}

export function showImageDiffTestFinishedToast(message: string) {
  testFinishedToastId = toast.success(message, {
    duration: IMAGE_DIFF_TOAST_DURATION,
  });
}

export function showImageDiffUpdateFinishedToast(message: string) {
  updateFinishedToastId = toast.success(message, {
    duration: IMAGE_DIFF_TOAST_DURATION,
  });
}

export function showImageDiffTestErrorToast(message: string) {
  testErrorToastId = toast.error(message, {
    duration: IMAGE_DIFF_TOAST_DURATION,
  });
}
