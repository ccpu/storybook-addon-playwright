import React, { SFC, useCallback } from 'react';
import { ActionList } from '../actions/ActionList';
import { ActionSet } from '../../typings';
import { Snackbar, Loader, ListItemWrapper, InputDialog } from '../common';
import { makeStyles } from '@material-ui/core';
import { useActionSchemaLoader, useActionSetEditor } from '../../hooks';
import { ActionSetEditorIcons } from './ActionSetEditorIcons';

const useStyles = makeStyles(
  () => {
    return {
      button: {
        marginTop: 20,
      },
      noActionMessage: {
        textAlign: 'center',
      },
      root: {
        height: '100%',
      },
    };
  },
  { name: 'ActionSetEditor' },
);

interface Props {
  // onClose: () => void;
  // onSaved: (actionSet: ActionSet) => void;
  actionSet: ActionSet;
}

const ActionSetEditor: SFC<Props> = ({ actionSet }) => {
  const [editDescription, setEditDescription] = React.useState(false);

  const {
    handleAddAction,
    handleDescriptionChange,
    handleSave,
    handleValidationSnackbarClose,
    validationResult,
  } = useActionSetEditor();

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

  const handleClose = useCallback(() => {
    throw new Error('Method not implemented.');
  }, []);

  return (
    <ListItemWrapper
      tooltip={actionSet.title}
      title={actionSet.title}
      draggable={true}
      icons={
        <ActionSetEditorIcons
          onAddAction={handleAddAction}
          onClose={handleClose}
          onEditDescription={toggleEditDescription}
          onSave={handleSave}
        />
      }
    >
      <div className={classes.root}>
        <ActionList actionSet={actionSet} />

        {validationResult && (
          <Snackbar
            open={true}
            // title="Validation failed."
            onClose={handleValidationSnackbarClose}
            variant="error"
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            autoHideDuration={60000}
            closeIcon={true}
          >
            <div style={{ width: 300 }}>
              {validationResult.map((result) => {
                return (
                  <div key={result.id}>
                    {result.required && (
                      <div key={result.id}>
                        <div>Action name: {result.name}</div>
                        <div style={{ fontSize: 12, marginLeft: 5 }}>
                          Required: {result.required.join(',')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Snackbar>
        )}
        <Loader open={loading} />
        {editDescription && (
          <InputDialog
            title="Edit description"
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
