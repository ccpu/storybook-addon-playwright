import DragIndicatorSharp from '@material-ui/icons/DragIndicatorSharp';
import clsx from 'clsx';
import React from 'react';
import { resolveMuiIcon } from '../../utils/resolve-mui-icon';

const DragIndicatorSharpIcon = resolveMuiIcon(DragIndicatorSharp);

export interface DragHandleProps extends React.HTMLAttributes<HTMLSpanElement> {
  setNodeRef?: (element: HTMLSpanElement | null) => void;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  className,
  setNodeRef,
  ...rest
}) => {
  return (
    <span
      className={clsx('drag-handle', className)}
      ref={setNodeRef}
      style={{ cursor: 'move', display: 'inline-flex' }}
      {...rest}
    >
      <DragIndicatorSharpIcon
        style={{
          cursor: 'move',
          fontSize: 25,
          marginLeft: -12,
          marginRight: 2,
        }}
      />
    </span>
  );
};

DragHandle.displayName = 'DragHandle';
