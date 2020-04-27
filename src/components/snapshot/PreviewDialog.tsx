import React, { SFC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '../common/ThemeProvider';
import HighlightOffOutlined from '@material-ui/icons/HighlightOffOutlined';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { ScreenshotList } from './ScreenshotList';

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

  dialogPaper: {
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
        <AppBar
          classes={{
            root: classes.appBar,
          }}
          position="relative"
          color="inherit"
        >
          <Toolbar className={classes.toolbar}>
            <div className={classes.toolbarRight}>
              <IconButton size="small" onClick={onClose}>
                <HighlightOffOutlined />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <ScreenshotList
          browserTypes={['chromium', 'firefox', 'webkit']}
          showStorybook={true}
        />
      </Dialog>
    </ThemeProvider>
  );
};

PreviewDialog.displayName = 'PreviewDialog';

export { PreviewDialog };
