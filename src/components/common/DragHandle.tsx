import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import DragIndicatorSharp from '@material-ui/icons/DragIndicatorSharp';

export const DragHandle = SortableHandle(() => (
  <DragIndicatorSharp
    style={{ cursor: 'move', fontSize: 25, marginLeft: -12, marginRight: 2 }}
  />
));
