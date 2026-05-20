import { WithTooltip } from '@storybook/components';
import React from 'react';

type StorybookWithTooltipProps = React.ComponentProps<typeof WithTooltip>;
type TooltipRenderArgs = { onHide: () => void };

const DEFAULT_MIN_VISIBLE_HEIGHT = 120;
const DEFAULT_VIEWPORT_BOTTOM_OFFSET = 12;
const DEFAULT_TOOLTIP_MAX_HEIGHT = '50vh';

interface TooltipContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  minVisibleHeight: number;
  style?: React.CSSProperties;
  viewportBottomOffset: number;
}

export interface AutoHeightWithTooltipProps extends Omit<
  StorybookWithTooltipProps,
  'tooltip'
> {
  tooltip: StorybookWithTooltipProps['tooltip'];
  minVisibleHeight?: number;
  tooltipClassName?: string;
  tooltipStyle?: React.CSSProperties;
  viewportBottomOffset?: number;
}

const getTooltipContent = (
  tooltip: StorybookWithTooltipProps['tooltip'],
  args: TooltipRenderArgs,
): React.ReactNode => {
  if (typeof tooltip === 'function') {
    return tooltip(args);
  }

  return tooltip;
};

const TooltipContentWrapper: React.FC<TooltipContentWrapperProps> = ({
  children,
  className,
  minVisibleHeight,
  style,
  viewportBottomOffset,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const updateMaxHeight = React.useCallback(() => {
    if (!ref.current) return;

    const top = ref.current.getBoundingClientRect().top;
    const availableHeight = Math.floor(window.innerHeight - top - viewportBottomOffset);
    const nextHeight = Math.max(minVisibleHeight, availableHeight);

    ref.current.style.maxHeight = `${nextHeight}px`;
  }, [minVisibleHeight, viewportBottomOffset]);

  React.useEffect(() => {
    updateMaxHeight();

    const frame = window.requestAnimationFrame(updateMaxHeight);

    window.addEventListener('resize', updateMaxHeight);
    window.addEventListener('scroll', updateMaxHeight, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateMaxHeight);
      window.removeEventListener('scroll', updateMaxHeight, true);
    };
  }, [children, updateMaxHeight]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        maxHeight: style?.maxHeight ?? DEFAULT_TOOLTIP_MAX_HEIGHT,
        overflowY: style?.overflowY ?? 'auto',
      }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
};

const AutoHeightWithTooltip: React.FC<AutoHeightWithTooltipProps> = ({
  minVisibleHeight = DEFAULT_MIN_VISIBLE_HEIGHT,
  tooltip,
  tooltipClassName,
  tooltipStyle,
  viewportBottomOffset = DEFAULT_VIEWPORT_BOTTOM_OFFSET,
  ...props
}) => {
  const wrappedTooltip = React.useCallback(
    (args: TooltipRenderArgs) => {
      return (
        <TooltipContentWrapper
          className={tooltipClassName}
          minVisibleHeight={minVisibleHeight}
          style={tooltipStyle}
          viewportBottomOffset={viewportBottomOffset}
        >
          {getTooltipContent(tooltip, args)}
        </TooltipContentWrapper>
      );
    },
    [minVisibleHeight, tooltip, tooltipClassName, tooltipStyle, viewportBottomOffset],
  );

  return <WithTooltip {...props} tooltip={wrappedTooltip} />;
};

AutoHeightWithTooltip.displayName = 'AutoHeightWithTooltip';

export { AutoHeightWithTooltip };
