import React, { SFC, memo, useCallback, useEffect, useState } from 'react';
import { ActionList } from '../screenshot-actions/ActionList';
import { StoryAction, ActionSet } from '../../../typings';
import {
  useActionDispatchContext,
  useActionContext,
} from '../../../store/actions';
import { ActionToolbar } from '../screenshot-actions/ActionToolbar';
import { nanoid } from 'nanoid';
import { validateActionList, ActionListValidationResult } from '../../../utils';
import { Snackbar } from '../../common';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';

const useStyles = makeStyles(
  (theme) => {
    return {
      button: {
        marginTop: 20,
      },
      noActionMessage: {
        textAlign: 'center',
      },
      root: {
        backgroundColor: theme.palette.background.default,
        height: '100%',
      },
      wrapper: {
        height: '100%',
      },
    };
  },
  { name: 'ActionSetEditor' },
);

interface Props {
  onClose: () => void;
  onSaved: (actionSet: ActionSet) => void;
}

const ActionSetEditor: SFC<Props> = memo(({ onClose, onSaved: onComplete }) => {
  const dispatch = useActionDispatchContext();

  const classes = useStyles();

  const state = useActionContext();

  const [validationResult, setValidationResult] = useState<
    ActionListValidationResult[]
  >();

  const handleAddAction = useCallback(
    (actionName: string) => {
      const actionId = nanoid(10);
      const newAction: StoryAction = {
        id: actionId,
        name: actionName,
      };

      dispatch({ action: newAction, type: 'addActionSetAction' });
      dispatch({ actionId, type: 'toggleActionExpansion' });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({ type: 'clearActionExpansion' });
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    const validateResult = validateActionList(
      state.actionSchema,
      state.editorActionSet.actions,
    );

    if (validateResult) {
      setValidationResult(validateResult);
    } else {
      onComplete(state.editorActionSet);
    }
  }, [onComplete, state.actionSchema, state.editorActionSet]);

  const handleValidationSnackbarClose = useCallback(() => {
    setValidationResult(undefined);
  }, []);

  const handleDescriptionChange = useCallback(
    (description: string) => {
      dispatch({ description, type: 'setEditorActionDescription' });
    },
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <ActionToolbar
        onAddAction={handleAddAction}
        onClose={onClose}
        onSave={handleSave}
        description={state.editorActionSet && state.editorActionSet.description}
        onDescriptionChange={handleDescriptionChange}
      />
      <div className={classes.wrapper}>
        <ScrollArea vertical>
          <ActionList actionSet={state.editorActionSet} />
        </ScrollArea>
      </div>
      {validationResult && (
        <Snackbar
          open={true}
          title="Validation failed."
          onClose={handleValidationSnackbarClose}
          type="error"
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
    </div>
  );
});

ActionSetEditor.displayName = 'ActionSetEditor';

export { ActionSetEditor };
