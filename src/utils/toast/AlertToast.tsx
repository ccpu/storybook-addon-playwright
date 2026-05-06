import React from 'react';
import { CrossIcon, PassedIcon, FailedIcon, AlertIcon } from '@storybook/icons';
import { IconButton } from '@storybook/components';
import { getHighestZindex } from '@pixpilot/dom';

export type AlertVariant = 'error' | 'info' | 'warning' | 'success' | 'default';

export interface AlertBaseProps {
  variant?: AlertVariant;
  description?: React.ReactNode;
  duration?: number; // in milliseconds
  title?: string;
  className?: string;
  closeButton?: boolean;
}

export interface AlertToastProps extends AlertBaseProps {
  onClose?: () => void;
  description?: string;
  style?: React.CSSProperties;
}

const getVariantIcon = (variant: AlertVariant) => {
  switch (variant) {
    case 'success':
      return <PassedIcon />;
    case 'error':
      return <FailedIcon />;
    case 'warning':
      return <AlertIcon />;
    case 'info':
      return <AlertIcon />;
    default:
      return null;
  }
};

const getVariantIconColor = (variant: AlertVariant, isDarkMode: boolean) => {
  switch (variant) {
    case 'success':
      return isDarkMode ? '#4ade80' : '#166534';
    case 'error':
      return isDarkMode ? '#f87171' : '#991b1b';
    case 'warning':
      return isDarkMode ? '#fbbf24' : '#92400e';
    case 'info':
      return isDarkMode ? '#60a5fa' : '#1e40af';
    default:
      return 'currentColor';
  }
};

const AlertToast: React.FC<AlertToastProps> = ({
  title,
  description,
  variant = 'info',
  onClose,
  style,
  closeButton = true,
  ...rest
}) => {
  const isLightMode = document.body.classList.contains('light');

  const backgroundColor = isLightMode
    ? 'rgba(32, 34, 37, 0.98)'
    : 'rgba(238, 243, 246, 0.97)';
  const borderColor = isLightMode
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 255, 255, 0.1)';
  const textColor = isLightMode
    ? 'rgba(255, 255, 255, 0.88)'
    : 'rgba(34, 36, 37, 0.75)';
  const titleColor = isLightMode
    ? 'rgba(255, 255, 255, 0.96)'
    : 'rgb(115, 130, 140)';
  const closeButtonColor = isLightMode
    ? 'rgba(255, 255, 255, 0.72)'
    : 'rgba(34, 36, 37, 0.6)';

  const containerStyle: React.CSSProperties = {
    alignItems: 'center',
    background: backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '5px',
    boxShadow: isLightMode
      ? '0 14px 32px rgba(0, 0, 0, 0.35)'
      : '0 10px 28px rgba(15, 23, 42, 0.12)',
    color: textColor,
    display: 'flex',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    gap: '12px',
    maxWidth: '450px',
    overflow: 'hidden',
    padding: '12px 16px',
    position: 'relative',
    zIndex: getHighestZindex() + 1,
    ...style,
  };

  const variantIcon = getVariantIcon(variant);
  const variantIconColor = getVariantIconColor(variant, isLightMode);

  const descriptioncomponent =
    typeof description === 'string'
      ? description.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))
      : description;

  return (
    <div style={containerStyle} {...rest}>
      {variantIcon && (
        <div style={{ color: variantIconColor }}>{variantIcon}</div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              color: titleColor,
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: '16px',
              marginBottom: '2px',
            }}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={{
              fontSize: '11px',
              lineHeight: '14px',
              opacity: 0.9,
              overflowWrap: 'anywhere',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {descriptioncomponent}
          </div>
        )}
      </div>

      {onClose && closeButton && (
        <IconButton
          onClick={onClose}
          aria-label="Dismiss notification"
          title="Dismiss notification"
          style={{ color: closeButtonColor }}
        >
          <CrossIcon />
        </IconButton>
      )}
    </div>
  );
};

export default AlertToast;
