import React, { memo, SFC } from 'react';
import { StoryAction } from '../../../typings';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useActionSchema } from '../../../hooks';
import { ActionSchemaRenderer } from './ActionSchemaRenderer';
import { capitalize } from '../../../utils';

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

  const schema = useActionSchema(action.schemaKey);

  const classes = useStyles();

  // const onPredefinedOptions = useCallback(
  //   (options: ActionControlPredefinedOptions) => {
  //     action.options = { ...action, ...options };
  //     onChange(action);
  //   },
  //   [action, onChange],
  // );

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
          <ActionSchemaRenderer storyAction={action} schema={schema} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
});

ActionOptions.displayName = 'ActionOptions';

export { ActionOptions };
