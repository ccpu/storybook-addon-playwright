import React, { SFC, memo, useCallback, useEffect, useState } from 'react';
import { useStorybookApi } from '@storybook/api';
import { ActionList } from '../screenshot-actions/ActionList';
import { StoryAction, StoryInput } from '../../../typings';
import {
  useActionDispatchContext,
  useActionContext,
} from '../../../store/actions';
import { ActionToolbar } from '../screenshot-actions/ActionToolbar';
import { nanoid } from 'nanoid';
import { saveActionSet } from '../../../api/client/save-action-set';
import { validateActionList, ActionListValidationResult } from '../../../utils';
import { Snackbar, Loader } from '../../common';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';

const useStyles = makeStyles(
  (theme) => {
    return {
      button: {
        marginTop: 20,
      },
      root: {
        backgroundColor: theme.palette.background.default,
        height: '100%',
        // bottom: 0,
        // left: 0,
        // position: 'absolute',
        // right: 0,
        // top: 0,
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
  actionSetId: string;
}

const ActionSetEditor: SFC<Props> = memo(({ onClose, actionSetId }) => {
  const dispatch = useActionDispatchContext();

  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const [error, setError] = useState();

  const state = useActionContext();

  const api = useStorybookApi();

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

      dispatch({ action: newAction, type: 'addStoryAction' });
      dispatch({ actionId, type: 'toggleActionExpansion' });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({ type: 'clearActionExpansion' });
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    const data = (api.getCurrentStoryData() as unknown) as StoryInput;
    const actionSet = state.actionSets.find((x) => x.id === actionSetId);

    const validateResult = validateActionList(
      state.actionSchema,
      actionSet.actions,
    );

    if (!actionSet.actions.length) {
      return;
    }

    if (validateResult) {
      setValidationResult(validateResult);
    } else {
      setLoading(true);

      try {
        await saveActionSet({
          actionSet,
          fileName: data.parameters.fileName as string,
          storyId: data.id,
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    }
  }, [actionSetId, api, state.actionSchema, state.actionSets]);

  const handleValidationSnackbarClose = useCallback(() => {
    setValidationResult(undefined);
  }, []);

  const handleErrorSnackbarClose = useCallback(() => {
    setError(undefined);
  }, []);

  return (
    <div className={classes.root}>
      <ActionToolbar
        onAddAction={handleAddAction}
        onClose={onClose}
        onSave={handleSave}
      />
      <div className={classes.wrapper}>
        <ScrollArea vertical>
          <ActionList />
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
      <Loader open={loading} />
      {error && (
        <Snackbar
          open={true}
          message={error}
          onClose={handleErrorSnackbarClose}
          type="error"
        />
      )}
    </div>
  );
});

ActionSetEditor.displayName = 'ActionSetEditor';

export { ActionSetEditor };
