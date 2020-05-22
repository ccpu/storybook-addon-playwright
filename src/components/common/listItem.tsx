/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';
import EditIcon from '@material-ui/icons/EditSharp';
import CheckBox from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxChecked from '@material-ui/icons/CheckBox';
import { DragHandle } from './DragHandle';
import { SortableElement, SortableElementProps } from 'react-sortable-hoc';
import { ConfirmationPopover } from './ConfirmationPopover';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { divider, text },
    } = theme;

    return {
      column: {
        alignItems: 'center',
        display: 'flex',
      },
      icon: {
        fontSize: 18,
      },
      item: {
        alignItems: 'center',
        border: '1px solid ' + divider,
        color: text.primary,
        display: 'flex',
        fontSize: 13,
        justifyContent: 'space-between',
        marginBottom: 4,
        minHeight: '48px',
        padding: '5px 8px',
        paddingLeft: 16,
      },
    };
  },
  { name: 'ListItem' },
);

export interface ActionSetListItemProps<T> extends SortableElementProps {
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onCheckBoxClick?: (item: T) => void;
  item: T;
  checked?: boolean;
  title: string;
  useDeleteConfirmation?: boolean;
  draggable?: boolean;
}

export function ListItem<T>({
  onEdit,
  onDelete,
  item,
  onCheckBoxClick,
  checked,
  title,
  useDeleteConfirmation,
  draggable,
}: ActionSetListItemProps<T>) {
  const classes = useStyles();

  const [
    confirmAnchorEl,
    setConfirmAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (useDeleteConfirmation) {
        setConfirmAnchorEl(e.currentTarget);
      } else {
        onDelete(item);
      }
    },
    [item, onDelete, useDeleteConfirmation],
  );

  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const closeDeleteConfirmation = useCallback(() => {
    setConfirmAnchorEl(undefined);
  }, []);

  const handleCheckStateChanged = useCallback(() => {
    onCheckBoxClick(item);
  }, [item, onCheckBoxClick]);

  const handleDeleteConfirmation = useCallback(() => {
    closeDeleteConfirmation();
    onDelete(item);
  }, [closeDeleteConfirmation, item, onDelete]);

  return (
    <div className={classes.item}>
      <div className={classes.column}>
        {draggable && <DragHandle />}
        {title}
      </div>
      <div className={classes.column}>
        <IconButton className="edit-button" onClick={handleEdit} size="small">
          <EditIcon className={classes.icon} />
        </IconButton>
        {onCheckBoxClick && (
          <IconButton
            className="check-box"
            onClick={handleCheckStateChanged}
            size="small"
          >
            {checked ? (
              <CheckBoxChecked className={classes.icon} />
            ) : (
              <CheckBox className={classes.icon} />
            )}
          </IconButton>
        )}
        <IconButton className="del-button" onClick={handleDelete} size="small">
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </div>
      {useDeleteConfirmation && confirmAnchorEl && (
        <ConfirmationPopover
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmation}
          anchorEl={confirmAnchorEl}
        />
      )}
    </div>
  );
}

ListItem.displayName = 'ListItem';

const SortableListItem = (SortableElement((props) => (
  <ListItem {...props} draggable={true} />
)) as unknown) as typeof ListItem;

export { SortableListItem };
