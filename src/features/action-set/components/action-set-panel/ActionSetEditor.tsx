import type { ActionSet } from '../../../../typings';
import { Divider, makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import {
  InputDialog,
  ListItemWrapper,
  Loader,
} from '../../../../components/common';
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
  const [editDescription, setEditDescription] = React.useState(false);

  const {
    handleAddAction,
    handleDescriptionChange,
    handleSave,
    cancelEditActionSet,
  } = useActionEditor(actionSet);

  const classes = useStyles();

  const { loading } = useActionSchemaLoader();

  const toggleEditDescription = useCallback(() => {
    setEditDescription(!editDescription);
  }, [editDescription]);

  const saveDescription = useCallback(
    (desc: string) => {
      handleDescriptionChange(desc);
      setEditDescription(!editDescription);
    },
    [editDescription, handleDescriptionChange],
  );

  return (
    <ListItemWrapper
      tooltip={
        actionSet.temp ? actionSet.title + TEMP_ACTION_SET : actionSet.title
      }
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
        {editDescription && (
          <InputDialog
            title="Edit Description"
            value={actionSet.title}
            open={true}
            onClose={toggleEditDescription}
            onSave={saveDescription}
          />
        )}
      </div>
    </ListItemWrapper>
  );
};

ActionSetEditor.displayName = 'ActionSetEditor';

export { ActionSetEditor };
