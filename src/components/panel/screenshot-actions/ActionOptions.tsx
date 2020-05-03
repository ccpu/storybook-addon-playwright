import React, {
  memo,
  SFC,
  useContext,
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
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ActionSchemaRenderer } from './ActionSchemaRenderer';
import { capitalize, getActionSchema } from '../../../utils';
import { ActionContext, ActionDispatchContext } from '../../../store';
import { useAction } from '../../../hooks';
import { getActionOptionValue } from './utils';

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
      },
    };
  },
  { name: 'ActionOptions' },
);

export interface ActionOptionsProps {
  actionId: string;
  actionName: string;
}

const ActionOptions: SFC<ActionOptionsProps> = memo((props) => {
  const { actionId, actionName } = props;

  const [subtitle, setSubtitle] = useState<string[]>();

  const action = useAction(actionId);

  const state = useContext(ActionContext);
  const dispatch = useContext(ActionDispatchContext);

  const schema = getActionSchema(state.actionSchema, actionName);

  const classes = useStyles();

  const handleExpand = useCallback(() => {
    dispatch({ actionId, type: 'toggleActionExpansion' });
  }, [actionId, dispatch]);

  useEffect(() => {
    if (!action || !action.subtitleItems) return;
    const titles = action.subtitleItems.reduce((arr, path) => {
      const label = path.split('.').pop();
      const value = getActionOptionValue(action, actionName, path);
      if (value) {
        arr.push(`${label}: ${value}`);
      }
      return arr;
    }, []);

    setSubtitle(titles);
  }, [action, actionName]);

  return useMemo(() => {
    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={state.expandedActions[actionId] === true}
          onChange={handleExpand}
          className={classes.expansionPanel}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.summary}
          >
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
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.detailPanel}>
            {state.expandedActions[actionId] && (
              <ActionSchemaRenderer
                schema={schema}
                path={actionName}
                actionId={actionId}
              />
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }, [
    actionId,
    actionName,
    classes.chip,
    classes.detailPanel,
    classes.expansionPanel,
    classes.heading,
    classes.root,
    classes.subtitleWrap,
    classes.summary,
    handleExpand,
    schema,
    state.expandedActions,
    subtitle,
  ]);
});

ActionOptions.displayName = 'ActionOptions';

export { ActionOptions };
