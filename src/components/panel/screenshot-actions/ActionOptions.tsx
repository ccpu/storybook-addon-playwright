import React, {
  memo,
  SFC,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles,
  Typography,
  Chip,
  IconButton,
} from '@material-ui/core';
import { ActionSchemaRenderer } from './ActionSchemaRenderer';
import { capitalize, getActionSchema } from '../../../utils';
import { useActionContext, useActionDispatchContext } from '../../../store';
import { useAction } from '../../../hooks';
import { getActionOptionValue } from './utils';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';

const useStyles = makeStyles(
  (theme) => {
    return {
      chip: {
        color: theme.palette.text.primary,
        height: 20,
        maxWidth: 150,
      },
      detailPanel: {
        display: 'block',
      },
      expanded: {
        transform: 'rotate(0deg) !important',
      },
      expansionPanel: {
        boxShadow: '0px 0.5px 4px -2px rgba(0,0,0,0.75)',
      },
      heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: 10,
      },
      root: {
        padding: 4,
        width: '100%',
      },
      subtitleWrap: {
        width: '100%',
      },
      summary: {
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      summaryInner: {
        display: 'flex',
      },
    };
  },
  { name: 'ActionOptions' },
);

export interface ActionOptionsProps {
  actionId: string;
  actionName: string;
  DragHandle: React.ComponentType;
}

const ActionOptions: SFC<ActionOptionsProps> = memo((props) => {
  const { actionId, actionName, DragHandle } = props;

  const [subtitle, setSubtitle] = useState<string[]>();

  const action = useAction(actionId);

  const state = useActionContext();
  const dispatch = useActionDispatchContext();

  const schema = getActionSchema(state.actionSchema, actionName);

  const classes = useStyles();

  const handleExpand = useCallback(() => {
    dispatch({ actionId, type: 'toggleActionExpansion' });
  }, [actionId, dispatch]);

  useEffect(() => {
    if (!action || !action.subtitleItems) return;
    const titles = action.subtitleItems.reduce((arr, path) => {
      const label = path.split('.').pop();
      const value = getActionOptionValue(action, path);
      if (value) {
        arr.push(`${label}: ${value}`);
      }
      return arr;
    }, []);

    setSubtitle(titles);
  }, [action, actionName]);

  const handleDeleteAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({ actionId, type: 'deleteActionSetAction' });
    },
    [actionId, dispatch],
  );

  return (
    <div className={classes.root}>
      <ExpansionPanel
        expanded={state.expandedActions[actionId] === true}
        onChange={handleExpand}
        className={classes.expansionPanel}
        square
        TransitionProps={{
          timeout: 100,
        }}
      >
        <ExpansionPanelSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          classes={{
            content: classes.summary,
            expanded: classes.expanded,
          }}
        >
          <div className={classes.summaryInner}>
            <DragHandle />
            <div className={classes.heading}>
              <Typography>
                {capitalize(schema && schema.title ? schema.title : actionName)}
              </Typography>
            </div>

            <div className={classes.subtitleWrap}>
              {subtitle &&
                subtitle.map((sub) => (
                  <Chip
                    className={classes.chip}
                    key={sub}
                    size="small"
                    label={sub}
                    variant="outlined"
                    title={sub}
                  />
                ))}
            </div>
          </div>
          <div>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleDeleteAction}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.detailPanel}>
          {state.expandedActions[actionId] && (
            <ActionSchemaRenderer schema={schema} actionId={actionId} />
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
});

ActionOptions.displayName = 'ActionOptions';

export { ActionOptions };
