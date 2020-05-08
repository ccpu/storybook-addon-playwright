import React, { SFC, useMemo } from 'react';
import { ActionOptions } from './ActionOptions';
import { useActionSetActions } from '../../../hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorSharp from '@material-ui/icons/DragIndicatorSharp';

const _dragEl = document.getElementById('draggable');

const getListStyle = (isDraggingOver) => ({
  // position: 'static',
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer

  // change background colour if dragging
  userSelect: 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const ActionList: SFC = () => {
  const { actionSetActions } = useActionSetActions();

  // return useMemo(() => {
  if (!actionSetActions.length) return null;
  return (
    <DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={getListStyle(droppableSnapshot.isDraggingOver)}
          >
            {actionSetActions.map((action, index) => (
              <Draggable key={action.id} draggableId={action.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    style={getItemStyle(
                      draggableSnapshot.isDragging,
                      draggableProvided.draggableProps.style,
                    )}
                  >
                    <ActionOptions
                      key={action.id}
                      actionName={action.name}
                      actionId={action.id}
                      DragHandle={() => (
                        <div {...draggableProvided.dragHandleProps}>
                          <DragIndicatorSharp />
                        </div>
                      )}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
  // }, [actionSetActions]);
};

ActionList.displayName = 'ActionList';

export { ActionList };
