import type { Theme } from '@mui/material';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  /** When true, no dimmed backdrop is drawn behind the dialog (MUI-compatible). */
  hideBackdrop?: boolean;
  width?: number | string;
  height?: number | string;
  /** Class applied to the dialog paper. */
  className?: string;
  style?: React.CSSProperties;
  'aria-labelledby'?: string;
  children?: React.ReactNode;
}

const MODAL_Z_INDEX = 1300;
const OVERLAY_PADDING = 32;
const SHADOW_ELEVATION = 24;

const useStyles = makeStyles(
  (theme: Theme) => ({
    overlay: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: OVERLAY_PADDING,
      zIndex: MODAL_Z_INDEX,
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[SHADOW_ELEVATION],
      color: theme.palette.text.primary,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%',
      maxWidth: '100%',
      outline: 0,
      overflow: 'hidden',
    },
  }),
  { name: 'Modal' },
);

/**
 * Controlled modal dialog built on `@floating-ui/react` (portal, backdrop,
 * focus trap, scroll lock, escape/outside-press dismissal), replacing
 * `@mui/material`'s `Dialog`. Centers its paper within a full-screen overlay.
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  hideBackdrop,
  width,
  height,
  className,
  style,
  'aria-labelledby': ariaLabelledby,
  children,
}) => {
  const classes = useStyles();

  const { refs, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => {
      if (!nextOpen) onClose?.();
    },
  });

  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!open) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        className={classes.overlay}
        style={{ background: hideBackdrop ? 'transparent' : 'rgba(0, 0, 0, 0.5)' }}
      >
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            aria-labelledby={ariaLabelledby}
            className={clsx(classes.paper, className)}
            style={{ height, width, ...style }}
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

Modal.displayName = 'Modal';

export { Modal };
