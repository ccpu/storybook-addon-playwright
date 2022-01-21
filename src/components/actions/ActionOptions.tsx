import React, { memo, useCallback, useState, useEffect } from 'react';
import { AccordionDetails, Chip, IconButton, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { ActionSchemaRenderer } from './ActionSchemaRenderer';
import { capitalize, getActionSchema } from '../../utils';
import { useActionContext, useActionDispatchContext } from '../../store';
import { useEditorAction, useCurrentStoryData } from '../../hooks';
import { getActionOptionValue } from './utils';
import DeleteIcon from '@mui/icons-material/DeleteOutlineSharp';
import HelpIcon from '@mui/icons-material/HelpOutline';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    const { divider } = theme.palette;
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
        border: '1px solid ' + divider,
        boxShadow: 'none',
      },
      heading: {
        alignItems: 'center',
        display: 'flex',
        fontWeight: theme.typography.fontWeightRegular as never,
        marginRight: 10,
      },
      icon: {
        fontSize: 20,
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
  actionSetId: string;
}

const ActionOptions: React.FC<ActionOptionsProps> = memo((props) => {
  const { actionId, actionName, DragHandle, actionSetId } = props;

  const [subtitle, setSubtitle] = useState<string[]>();

  const story = useCurrentStoryData();
  const state = useActionContext();
  const dispatch = useActionDispatchContext();

  const action = useEditorAction(story && story.id, actionId);
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
      dispatch({
        actionId,
        actionSetId,
        storyId: story.id,
        type: 'deleteActionSetAction',
      });
    },
    [actionId, actionSetId, dispatch, story],
  );

  const hasParameters =
    schema && schema.parameters && Object.keys(schema.parameters).length !== 0;

  return (
    <div className={classes.root}>
      <Accordion
        expanded={
          state.expandedActions &&
          state.expandedActions[actionId] === true &&
          hasParameters
        }
        onChange={handleExpand}
        className={classes.expansionPanel}
        square
        TransitionProps={{
          timeout: 100,
        }}
      >
        <AccordionSummary
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
              {capitalize(schema && schema.title ? schema.title : actionName)}
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
            <Tooltip
              title={
                schema && schema.description
                  ? schema.description
                  : 'Not Available!'
              }
            >
              <IconButton size="small">
                <HelpIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleDeleteAction}
            >
              <DeleteIcon className={classes.icon} />
            </IconButton>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.detailPanel}>
          {state.expandedActions &&
            state.expandedActions[actionId] &&
            hasParameters && (
              <ActionSchemaRenderer
                schema={schema}
                actionId={actionId}
                actionSetId={actionSetId}
              />
            )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
});

ActionOptions.displayName = 'ActionOptions';

export { ActionOptions };
