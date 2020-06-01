import React, { SFC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '../common/ThemeProvider';
import { ScreenshotListView } from './ScreenshotListView';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.divider,
    boxShadow: 'none',
  },

  closeIconAbsolute: {
    position: 'absolute',
    right: 30,
    top: 30,
  },

  container: {
    height: '100%',
  },

  dialogPaper: {
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    minWidth: '100%',
    overflow: 'hidden',
  },

  toolbar: {
    minHeight: 'auto',
  },

  toolbarRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
}));

export interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
}

const PreviewDialog: SFC<PreviewDialogProps> = (props) => {
  const { onClose, open } = props;

  const classes = useStyles();

  return (
    <ThemeProvider>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        hideBackdrop={true}
        classes={{
          paper: classes.dialogPaper,
        }}
      >
        <div className={classes.container}>
          <ScreenshotListView
            showStorybook={true}
            column={2}
            onClose={onClose}
            viewPanel="dialog"
          />
        </div>
      </Dialog>
    </ThemeProvider>
  );
};

PreviewDialog.displayName = 'PreviewDialog';

export { PreviewDialog };
