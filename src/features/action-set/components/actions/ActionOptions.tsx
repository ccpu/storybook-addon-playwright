import type { DragHandleProps } from '../../../../components/common';
import { AccordionDetails, Chip, makeStyles, Tooltip } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { IconButton } from '@storybook/components';
import { QuestionIcon, TrashIcon } from '@storybook/icons';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { capitalize, getActionSchema } from '../../../../utils';
import { useEditorAction } from '../../hooks/use-editor-action';
import {
  deleteActionSetAction,
  toggleActionExpansion,
} from '../../store/actions';

import { useActionSetStoreState } from '../../store/selectors';
import { ActionSchemaRenderer } from './ActionSchemaRenderer';
import { getActionOptionValue } from './utils/index';

const useStyles = makeStyles(
  (theme) => {
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
        border: `1px solid ${divider}`,
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
  DragHandle: React.ComponentType<DragHandleProps>;
  actionSetId: string;
  dragHandleProps?: DragHandleProps;
}

const ActionOptions: React.FC<ActionOptionsProps> = memo((props) => {
  const { actionId, actionName, DragHandle, actionSetId, dragHandleProps } =
    props;

  const [subtitle, setSubtitle] = useState<string[]>();

  const story = useCurrentStoryData();
  const storyId = story?.id;
  const state = useActionSetStoreState();

  const action = useEditorAction(storyId || '', actionId);
  const schema = getActionSchema(state.actionSchema, actionName);

  const classes = useStyles();

  const handleExpand = useCallback(() => {
    toggleActionExpansion(actionId);
  }, [actionId]);

  useEffect(() => {
    if (!action || !action.subtitleItems) return;
    const titles = action.subtitleItems.reduce<string[]>((arr, path) => {
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
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!storyId) return;

      deleteActionSetAction({
        actionId,
        actionSetId,
        storyId,
      });
    },
    [actionId, actionSetId, storyId],
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
            <DragHandle {...dragHandleProps} />
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
              <IconButton>
                <QuestionIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleDeleteAction}>
              <TrashIcon className={classes.icon} />
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
