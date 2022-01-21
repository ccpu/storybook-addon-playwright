import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import DragIndicatorSharp from '@mui/icons-material/DragIndicatorSharp';

export const DragHandle = SortableHandle(() => (
  <DragIndicatorSharp
    style={{ cursor: 'move', fontSize: 25, marginLeft: -12, marginRight: 2 }}
  />
));
