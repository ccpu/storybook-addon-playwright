import type { Theme } from '../../styles';
import { makeStyles } from '../../styles';
import { AlertIcon, CheckIcon, InfoIcon } from '@storybook/icons';
import clsx from 'clsx';
import React from 'react';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

export interface AlertProps {
  severity?: AlertSeverity;
  /** MUI-compatible slot class overrides. */
  classes?: { root?: string; icon?: string; message?: string };
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const SEVERITY_ICON: Record<AlertSeverity, React.ElementType> = {
  error: AlertIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertIcon,
};

const tint = (color: string) => `color-mix(in srgb, ${color} 12%, transparent)`;

const useStyles = makeStyles(
  (theme: Theme) => ({
    error: {
      backgroundColor: tint(theme.palette.error.main),
      '& $icon': { color: theme.palette.error.main },
    },
    icon: {
      alignItems: 'center',
      display: 'flex',
      marginRight: '12px',
      opacity: 0.9,
    },
    info: {
      backgroundColor: tint(theme.palette.info.main),
      '& $icon': { color: theme.palette.info.main },
    },
    message: {
      color: theme.palette.text.primary,
      minWidth: 0,
      padding: '8px 0',
    },
    root: {
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      display: 'flex',
      fontSize: '0.875rem',
      padding: '6px 16px',
    },
    success: {
      backgroundColor: tint(theme.palette.success.main),
      '& $icon': { color: theme.palette.success.main },
    },
    warning: {
      backgroundColor: tint(theme.palette.warning.main),
      '& $icon': { color: theme.palette.warning.main },
    },
  }),
  { name: 'Alert' },
);

/**
 * A themed inline alert (icon + message) replacing `@mui/material`'s `Alert`.
 * Supports the `severity` and `classes` (root/icon/message) API used by the
 * existing call sites.
 */
const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  classes: classesProp,
  className,
  style,
  children,
}) => {
  const classes = useStyles();
  const Icon = SEVERITY_ICON[severity];

  return (
    <div
      role="alert"
      className={clsx(classes.root, classes[severity], classesProp?.root, className)}
      style={style}
    >
      <div className={clsx(classes.icon, classesProp?.icon)}>
        <Icon />
      </div>
      <div className={clsx(classes.message, classesProp?.message)}>{children}</div>
    </div>
  );
};

Alert.displayName = 'Alert';

export { Alert };
