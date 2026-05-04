import React from 'react';
import DragIndicatorSharp from '@material-ui/icons/DragIndicatorSharp';
import clsx from 'clsx';

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
      <DragIndicatorSharp
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
