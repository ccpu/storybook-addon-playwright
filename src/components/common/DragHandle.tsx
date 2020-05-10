import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import DragIndicatorSharp from '@material-ui/icons/DragIndicatorSharp';

export const DragHandle = SortableHandle(() => (
  <DragIndicatorSharp
    style={{ cursor: 'move', marginLeft: -10, marginRight: 5 }}
  />
));
