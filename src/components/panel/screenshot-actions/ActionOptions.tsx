import React, { memo, SFC, useCallback, useContext } from 'react';
import { StoryAction } from '../../../typings';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ActionSchemaRenderer } from './ActionSchemaRenderer';
import { capitalize, getActionSchema } from '../../../utils';
import { ActionContext } from '../../../store';

const useStyles = makeStyles(
  (theme) => {
    return {
      detailPanel: {
        display: 'block',
      },
      heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
      },
      root: {
        padding: 4,
        width: '100%',
      },
    };
  },
  { name: 'ActionOptions' },
);

export interface ActionOptionsProps {
  action: StoryAction;
  onChange: (action: StoryAction) => void;
}

const ActionOptions: SFC<ActionOptionsProps> = memo((props) => {
  const { action } = props;

  const { actionSchema, setActionOptions } = useContext(ActionContext);

  const schema = getActionSchema(actionSchema, action.schemaKey);

  const classes = useStyles();

  const handleChange = useCallback(
    (objPath: string, val: unknown) => {
      setActionOptions(action.id, objPath, val);
    },
    [action.id, setActionOptions],
  );

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading} variant="h1">
            {capitalize(
              schema && schema.title ? schema.title : action.schemaKey,
            )}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.detailPanel}>
          <ActionSchemaRenderer
            storyAction={action}
            schema={schema}
            path={action.schemaKey}
            onChange={handleChange}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
});

ActionOptions.displayName = 'ActionOptions';

export { ActionOptions };
