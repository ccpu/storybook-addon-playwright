import React, { SFC, memo, useCallback } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { ActionSet } from '../../../typings';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';
import EditIcon from '@material-ui/icons/EditSharp';
import CheckBox from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxChecked from '@material-ui/icons/CheckBox';

const useStyles = makeStyles(
  () => {
    return {
      column: {
        display: 'flex',
      },
      icon: {
        fontSize: 18,
      },
      item: {
        alignItems: 'center',
        boxShadow: '0px 0.5px 4px -2px rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: '48px',
        padding: '5px 8px',
        paddingLeft: 16,
      },
    };
  },
  { name: 'ActionSetListItem' },
);

export interface ActionSetListItemProps {
  onEdit: (actionSet: ActionSet) => void;
  onDelete: (setId: string) => void;
  onCheckBoxClick: (actionSet: ActionSet) => void;
  actionSet: ActionSet;
  checked?: boolean;
  DragHandle: React.ComponentType;
}

const ActionSetListItem: SFC<ActionSetListItemProps> = memo(
  ({ onEdit, onDelete, actionSet, onCheckBoxClick, checked, DragHandle }) => {
    const classes = useStyles();

    const handleDelete = useCallback(async () => {
      onDelete(actionSet.id);
    }, [actionSet.id, onDelete]);

    const handleEdit = useCallback(() => {
      onEdit(actionSet);
    }, [actionSet, onEdit]);

    const handleCheckStateChanged = useCallback(() => {
      onCheckBoxClick(actionSet);
    }, [actionSet, onCheckBoxClick]);

    return (
      <div className={classes.item} key={actionSet.id}>
        <div className={classes.column}>
          <DragHandle />
          {actionSet.description}
        </div>
        <div className={classes.column}>
          <IconButton onClick={handleEdit} size="small">
            <EditIcon className={classes.icon} />
          </IconButton>
          <IconButton onClick={handleCheckStateChanged} size="small">
            {checked ? (
              <CheckBoxChecked className={classes.icon} />
            ) : (
              <CheckBox className={classes.icon} />
            )}
          </IconButton>
          <IconButton onClick={handleDelete} size="small">
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </div>
      </div>
    );
  },
);

ActionSetListItem.displayName = 'ActionSetListItem';

export { ActionSetListItem };
