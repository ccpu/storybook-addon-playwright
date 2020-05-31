import React, { SFC } from 'react';
import { useEditScreenshot } from '../../hooks';
import { Alert } from '@material-ui/lab';
import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles(
  () => {
    return {
      alert: {
        padding: '0px 16px',
      },
      icon: {
        alignSelf: 'center',
      },
      message: {
        flex: 1,
      },
      messageWrapper: {
        alignSelf: 'center',
      },
      root: {
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      },
    };
  },
  { name: 'EditScreenshotAlert' },
);

const EditScreenshotAlert: SFC = () => {
  const {
    isEditingScreenshot,
    editScreenshotState,
    clearScreenshotEdit,
  } = useEditScreenshot();

  const classes = useStyles();

  if (!editScreenshotState || !isEditingScreenshot()) return null;

  return (
    <Alert
      classes={{
        icon: classes.icon,
        message: classes.message,
        root: classes.alert,
      }}
      severity="warning"
    >
      <div className={classes.root}>
        <div className={classes.messageWrapper}>
          {`Editing '${editScreenshotState.screenshotData.title}' screenshot (${editScreenshotState.screenshotData.browserType}).`}
        </div>

        <div>
          <Button size="small" color="inherit" onClick={clearScreenshotEdit}>
            Cancel
          </Button>
        </div>
      </div>
    </Alert>
  );
};

EditScreenshotAlert.displayName = 'EditScreenshotAlert';

export { EditScreenshotAlert };
