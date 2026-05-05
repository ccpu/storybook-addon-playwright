/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditSharp';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ListItemWrapper,
  DeleteConfirmationButton,
  CheckBox,
} from '../../../../components/common';
import { ActionSet } from '../../../../typings';
import { ActionSetEditor } from './ActionSetEditor';
import { TEMP_ACTION_SET } from '../../../../constants';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { AddFavouriteAction } from './AddFavouriteAction';

export interface ActionSetActionSetListItemProps {
  onEdit: (item: ActionSet) => void;
  onDelete: (item: ActionSet) => void;
  onCheckBoxClick?: (item: ActionSet) => void;
  onCopy?: (item: ActionSet) => void;
  item: ActionSet;
  checked?: boolean;
  title: string;
  isEditing?: boolean;
  hideIcons?: boolean;
  index?: number;
  sortableId?: string;
}

export function ActionSetListItem({
  onEdit,
  onDelete,
  item,
  onCheckBoxClick,
  checked,
  title,
  isEditing,
  hideIcons,
  onCopy,
  sortableId,
}: ActionSetActionSetListItemProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    disabled: Boolean(isEditing),
    id: sortableId ?? item.id,
  });

  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const handleCheckStateChanged = useCallback(() => {
    if (onCheckBoxClick) {
      onCheckBoxClick(item);
    }
  }, [item, onCheckBoxClick]);

  const handleDeleteConfirmation = useCallback(() => {
    onDelete(item);
  }, [item, onDelete]);

  const handleCopyActionSet = useCallback(() => {
    if (onCopy) {
      onCopy(item);
    }
  }, [item, onCopy]);

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        <ActionSetEditor actionSet={item} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: 1,
      }}
    >
      <ListItemWrapper
        tooltip={title + (item.temp ? TEMP_ACTION_SET : '')}
        title={title + (item.temp ? ' *' : '')}
        draggable={true}
        selected={checked}
        dragHandleProps={{
          ...(attributes as React.HTMLAttributes<HTMLSpanElement>),
          ...(listeners as React.HTMLAttributes<HTMLSpanElement>),
          setNodeRef: setActivatorNodeRef as (
            element: HTMLSpanElement | null,
          ) => void,
        }}
        icons={
          <>
            {!hideIcons && (
              <IconButton
                className="edit-button"
                onClick={handleEdit}
                size="small"
                title="Edit"
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              className="copy-button"
              onClick={handleCopyActionSet}
              size="small"
              title="Copy"
            >
              <FileCopyOutlinedIcon />
            </IconButton>

            {!hideIcons && <AddFavouriteAction item={item} />}
            <CheckBox
              onClick={handleCheckStateChanged}
              checked={Boolean(checked)}
            />
            {!hideIcons && (
              <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />
            )}
          </>
        }
      />
    </div>
  );
}

ActionSetListItem.displayName = 'ActionSetListItem';

const SortableActionSetListItem: React.FC<ActionSetActionSetListItemProps> = (
  props,
) => <ActionSetListItem {...props} />;

SortableActionSetListItem.displayName = 'SortableActionSetListItem';

export { SortableActionSetListItem };
