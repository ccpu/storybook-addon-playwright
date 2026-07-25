import type { Placement } from '@floating-ui/react';
import type { Theme } from '../../styles';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { makeStyles } from '../../styles';
import { cx } from '@emotion/css';
import React from 'react';

type PopoverCloseReason = 'backdropClick' | 'escapeKeyDown';

export interface PopoverOrigin {
  vertical: 'top' | 'center' | 'bottom' | number;
  horizontal: 'left' | 'center' | 'right' | number;
}

export interface PopoverProps {
  open: boolean;
  anchorEl?: Element | null;
  /** MUI-compatible anchor origin. Mapped to the closest Floating UI placement. */
  anchorOrigin?: PopoverOrigin;
  /** Accepted for MUI compatibility (positioning is handled by Floating UI). */
  transformOrigin?: PopoverOrigin;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // `event` is `unknown` so callers can pass either a no-argument handler or one
  // that ignores the event (as the old MUI `Popover` callers did).
  onClose?: (event: unknown, reason?: PopoverCloseReason) => void;
}

const PAPER_OFFSET = 8;
const VIEWPORT_MARGIN = 32;
const MIN_PAPER_SIZE = 16;
// Never shrink the paper below this height, even when the anchor sits at the
// very edge of the viewport — the paper scrolls internally instead.
const MIN_AVAILABLE_HEIGHT = 80;
const SHADOW_ELEVATION = 8;
const POPOVER_Z_INDEX = 1300;

const useStyles = makeStyles(
  (theme: Theme) => ({
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[SHADOW_ELEVATION],
      color: theme.palette.text.primary,
      // A sensible upper bound until the `size` middleware measures the real
      // space available for the resolved placement (see `apply` below).
      maxHeight: `calc(100vh - ${VIEWPORT_MARGIN}px)`,
      maxWidth: `calc(100vw - ${VIEWPORT_MARGIN}px)`,
      minWidth: MIN_PAPER_SIZE,
      outline: 0,
      // Scroll internally when the content is taller than the available space.
      overflowX: 'hidden',
      overflowY: 'auto',
    },
  }),
  { name: 'Popover' },
);

const resolveVerticalSide = (origin?: PopoverOrigin): 'top' | 'bottom' =>
  origin?.vertical === 'top' ? 'top' : 'bottom';

const resolveAlignment = (origin?: PopoverOrigin): '' | '-start' | '-end' => {
  if (origin?.horizontal === 'right') return '-end';
  if (origin?.horizontal === 'center') return '';
  return '-start';
};

// Map MUI's `anchorOrigin` to the closest Floating UI placement.
const getPlacement = (anchorOrigin?: PopoverOrigin): Placement =>
  `${resolveVerticalSide(anchorOrigin)}${resolveAlignment(anchorOrigin)}` as Placement;

/**
 * Controlled popover built on `@floating-ui/react`, exposing a small
 * MUI-`Popover`-compatible API (`open`, `anchorEl`, `onClose`, `anchorOrigin`)
 * so it can replace the old `@mui/material` `Popover` at existing call sites.
 *
 * The paper automatically caps its height to the space available for the
 * resolved placement (via the `size` middleware) and scrolls when its content
 * would otherwise overflow the viewport.
 */
const Popover: React.FC<PopoverProps> = ({
  open,
  anchorEl,
  anchorOrigin,
  className,
  style,
  children,
  onClose,
}) => {
  const classes = useStyles();

  const { refs, floatingStyles, context } = useFloating({
    elements: { reference: anchorEl ?? null },
    middleware: [
      offset(PAPER_OFFSET),
      flip({ padding: PAPER_OFFSET }),
      shift({ padding: PAPER_OFFSET }),
      size({
        padding: PAPER_OFFSET,
        // Constrain the paper to the height/width actually available for the
        // resolved side. Applied imperatively (per Floating UI guidance) so it
        // does not trigger a React re-render loop with `autoUpdate`.
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(MIN_AVAILABLE_HEIGHT, Math.floor(availableHeight))}px`,
            maxWidth: `${Math.floor(availableWidth)}px`,
          });
        },
      }),
    ],
    onOpenChange: (nextOpen, event, reason) => {
      if (!nextOpen && onClose) {
        onClose(event, reason === 'escape-key' ? 'escapeKeyDown' : 'backdropClick');
      }
    },
    open,
    placement: getPlacement(anchorOrigin),
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const { getFloatingProps } = useInteractions([dismiss]);

  if (!open || !anchorEl) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        className={cx(classes.paper, className)}
        style={{ ...floatingStyles, ...style, zIndex: POPOVER_Z_INDEX }}
        {...getFloatingProps()}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};

Popover.displayName = 'Popover';

export { Popover };
