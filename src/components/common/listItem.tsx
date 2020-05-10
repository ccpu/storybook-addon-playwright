/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';
import EditIcon from '@material-ui/icons/EditSharp';
import CheckBox from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxChecked from '@material-ui/icons/CheckBox';
import { DragHandle } from './DragHandle';
import { SortableElement, SortableElementProps } from 'react-sortable-hoc';

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
        marginBottom: 2,
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
  description: string;
}

function ListItem<T>({
  onEdit,
  onDelete,
  item,
  onCheckBoxClick,
  checked,
  description,
}: ActionSetListItemProps<T>) {
  const classes = useStyles();

  const handleDelete = useCallback(async () => {
    onDelete(item);
  }, [item, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const handleCheckStateChanged = useCallback(() => {
    onCheckBoxClick(item);
  }, [item, onCheckBoxClick]);

  return (
    <div className={classes.item}>
      <div className={classes.column}>
        <DragHandle />
        {description}
      </div>
      <div className={classes.column}>
        <IconButton onClick={handleEdit} size="small">
          <EditIcon className={classes.icon} />
        </IconButton>
        {onCheckBoxClick && (
          <IconButton onClick={handleCheckStateChanged} size="small">
            {checked ? (
              <CheckBoxChecked className={classes.icon} />
            ) : (
              <CheckBox className={classes.icon} />
            )}
          </IconButton>
        )}
        <IconButton onClick={handleDelete} size="small">
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </div>
    </div>
  );
}

ListItem.displayName = 'ListItem';

const item = (SortableElement(ListItem) as unknown) as typeof ListItem;

export { item as ListItem };
