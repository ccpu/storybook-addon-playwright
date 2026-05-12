import type { ExternalToast, ToastT } from 'sonner';
import type { AlertBaseProps, AlertToastProps, AlertVariant } from './AlertToast';
import { simpleHash } from '@pixpilot/hash';
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import AlertToast from './AlertToast';

export const DEFAULT_ALERT_DURATION = 10_000;

interface ToastOwnProps extends Pick<
  ToastT,
  'dismissible' | 'duration' | 'position' | 'onAutoClose' | 'onDismiss' | 'closeButton'
> {
  id?: string;
}

interface ToastProps extends AlertBaseProps, ToastOwnProps {
  description?: string;
}

export type ToastMessage =
  | string
  | ({ title: string; description: string } & AlertToastProps);

interface ToastCustomRenderProps {
  id: string | number;
  dismiss: () => void;
}

type ToastCustomContent =
  | React.ReactElement
  | ((props: ToastCustomRenderProps) => React.ReactElement);

export interface ToastFunction {
  (props: ToastProps): string;
  error: (message: ToastMessage, options?: ToastOwnProps) => string;
  success: (message: ToastMessage, options?: ToastOwnProps) => string;
  warning: (message: ToastMessage, options?: ToastOwnProps) => string;
  info: (message: ToastMessage, options?: ToastOwnProps) => string;
  custom: (component: ToastCustomContent, options?: ExternalToast) => string | number;
  dismiss: (id: string | number) => void;
  dismissAll: () => void;
}

// Track toast instances with counter
const toastInstances = new Map<string, { currentId: string; counter: number }>();

function getToastId(baseId: string) {
  // Get or initialize the instance tracker
  const instance = toastInstances.get(baseId);

  if (instance) {
    // Dismiss the previous instance
    sonnerToast.dismiss(instance.currentId);

    // Increment counter and create new ID
    instance.counter += 1;
    instance.currentId = `${baseId}_${instance.counter}`;
  } else {
    // First time showing this toast
    toastInstances.set(baseId, {
      counter: 0,
      currentId: `${baseId}_0`,
    });
  }

  const currentInstance = toastInstances.get(baseId);
  return currentInstance?.currentId ?? baseId;
}

function getToastHandlers(baseId: string) {
  const cleanUp = (tId: string | number) => {
    const latestInstance = toastInstances.get(baseId);
    if (latestInstance && latestInstance.currentId === tId) {
      toastInstances.delete(baseId);
    }
  };

  return {
    onAutoClose: (t: ToastT) => {
      cleanUp(t.id);
    },
    onDismiss: (t: ToastT) => {
      cleanUp(t.id);
    },
  };
}
const toast: ToastFunction = function (props: ToastProps) {
  const { duration, id, dismissible = true, position, ...rest } = props;

  let toastId: string;
  let handlers: ReturnType<typeof getToastHandlers> | undefined;

  if (id != null) {
    // Use explicit ID directly - no tracking or counter
    toastId = id;
  } else {
    // Auto-generated ID with tracking for replacement
    const baseId = `toast_${simpleHash(
      `${props.title ?? ''}::${props.description ?? ''}`,
    )}`;
    toastId = getToastId(baseId);
    handlers = getToastHandlers(baseId);
  }

  sonnerToast.custom(
    (t) => (
      <AlertToast
        {...rest}
        onClose={dismissible ? () => sonnerToast.dismiss(t) : undefined}
      />
    ),
    {
      duration: duration ?? DEFAULT_ALERT_DURATION,
      id: toastId,
      position,
      ...handlers,
    },
  );

  return toastId;
};

function createToast(
  variant: AlertVariant,
  message: ToastMessage,
  options?: ToastOwnProps,
) {
  if (typeof message === 'string') {
    return toast({ ...options, description: message, variant });
  }
  return toast({ ...options, ...message, variant });
}

toast.error = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('error', message, options);
toast.success = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('success', message, options);
toast.warning = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('warning', message, options);
toast.info = (message: ToastMessage, options?: ToastOwnProps) =>
  createToast('info', message, options);

toast.custom = (component: ToastCustomContent, options?: ExternalToast) => {
  const { duration, ...rest } = options || {};

  // 1. No tracking Map!
  // 2. No ID generation! (Sonner does this natively if `id` is missing)
  // 3. No counter suffixes!

  return sonnerToast.custom(
    (t) => {
      if (typeof component === 'function') {
        return component({
          dismiss: () => sonnerToast.dismiss(t),
          id: t,
        });
      }

      return component;
    },
    {
      duration: duration ?? DEFAULT_ALERT_DURATION,
      ...rest, // This passes 'id', 'position', etc., straight to Sonner
    },
  );
};
toast.dismiss = (id: string | number) => {
  sonnerToast.dismiss(id);
};

toast.dismissAll = () => {
  sonnerToast.dismiss();
  toastInstances.clear();
};

export { toast };
