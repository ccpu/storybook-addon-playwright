import React, { useCallback } from 'react';
import { ActionList } from '../actions/ActionList';
import { ActionSet } from '../../../../typings';
import {
  Loader,
  ListItemWrapper,
  InputDialog,
} from '../../../../components/common';
import { makeStyles, Divider } from '@material-ui/core';
import { useActionSchemaLoader, useActionEditor } from '../../../../hooks';
import { ActionSetEditorIcons } from './ActionSetEditorIcons';
import { TEMP_ACTION_SET } from '../../../../constants';

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
