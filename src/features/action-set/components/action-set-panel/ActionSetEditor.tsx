import type { ActionSet } from '../../../../typings';
import { Divider, makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { inputModal, ListItemWrapper, Loader } from '../../../../components/common';
import { TEMP_ACTION_SET } from '../../../../constants';
import { useActionEditor, useActionSchemaLoader } from '../../../../hooks';
import { ActionList } from '../actions/ActionList';
import { ActionSetEditorIcons } from './ActionSetEditorIcons';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { secondary },
    } = theme;

    return {
      divider: {
        backgroundColor: secondary.main,
      },
      root: {
        height: '100%',
      },
    };
  },
  { name: 'ActionSetEditor' },
);

interface Props {
  actionSet: ActionSet;
}

const ActionSetEditor: React.FC<Props> = ({ actionSet }) => {
  const { handleAddAction, handleDescriptionChange, handleSave, cancelEditActionSet } =
    useActionEditor(actionSet);

  const classes = useStyles();

  const { loading } = useActionSchemaLoader();

  const toggleEditDescription = useCallback(() => {
    void inputModal.show({
      onSave: handleDescriptionChange,
      title: 'Edit Description',
      value: actionSet.title,
    });
  }, [actionSet.title, handleDescriptionChange]);

  return (
    <ListItemWrapper
      tooltip={actionSet.temp ? actionSet.title + TEMP_ACTION_SET : actionSet.title}
      title={actionSet.temp ? `${actionSet.title} *` : actionSet.title}
      draggable={true}
      selected={true}
      secondaryColor={true}
      icons={
        <ActionSetEditorIcons
          onAddAction={handleAddAction}
          onCancel={cancelEditActionSet}
          onEditTitle={toggleEditDescription}
          onSave={handleSave}
        />
      }
    >
      <div className={classes.root}>
        <Divider className={classes.divider} />
        <ActionList actionSet={actionSet} />
        <Loader open={loading} />
      </div>
    </ListItemWrapper>
  );
};

ActionSetEditor.displayName = 'ActionSetEditor';

export { ActionSetEditor };
