import React, { memo, SFC, useContext, useMemo } from 'react';
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
  actionId: string;
  actionName: string;
}

const ActionOptions: SFC<ActionOptionsProps> = memo((props) => {
  const { actionId, actionName } = props;

  const { state } = useContext(ActionContext);

  const schema = getActionSchema(state.actionSchema, actionName);

  const classes = useStyles();

  return useMemo(() => {
    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={true}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading} variant="h1">
              {capitalize(schema && schema.title ? schema.title : actionName)}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.detailPanel}>
            <ActionSchemaRenderer
              schema={schema}
              path={actionName}
              actionId={actionId}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }, [
    actionId,
    actionName,
    classes.detailPanel,
    classes.heading,
    classes.root,
    schema,
  ]);
});

ActionOptions.displayName = 'ActionOptions';

export { ActionOptions };
