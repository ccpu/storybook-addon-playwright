import React, { SFC } from 'react';

import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { SnapshotInfo } from '../../typings';
import { ThemeProvider } from './ThemeProvider';

import {
  GridList,
  GridListTile,
  Button,
  ButtonGroup,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { PreviewItem } from './PreviewItem';

const useStyles = makeStyles(() => ({
  buttons: {
    padding: 2,
    textAlign: 'right',
  },
  dialogPaper: {
    // maxHeight: '95%',
    maxWidth: '95%',
    // minHeight: '95%',
    minWidth: '95%',
    overflow: 'hidden',
  },

  error: {
    color: 'red',
    padding: 30,
    textAlign: 'center',
  },

  gridListTile: {
    minHeight: 500,
  },

  progress: {
    left: -3,
    position: 'absolute',
    top: 7,
    zIndex: 1,
  },
  toolbar: {
    // boxShadow: 'none',
    minHeight: 'auto',
  },
}));

export interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  snapshots?: SnapshotInfo[] | string;
}

const PreviewDialog: SFC<PreviewDialogProps> = (props) => {
  const { snapshots, onClose, open } = props;

  const handleClose = () => {
    onClose();
  };
  const classes = useStyles();

  return (
    <ThemeProvider>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        hideBackdrop={true}
        classes={{
          paper: classes.dialogPaper,
        }}
      >
        {!snapshots || typeof snapshots === 'string' ? (
          <div className={classes.error}>{snapshots}</div>
        ) : (
          <>
            <AppBar position="relative" color="secondary">
              <Toolbar className={classes.toolbar}>
                <ButtonGroup variant="text" fullWidth>
                  <Button>Close</Button>
                  <Button>Save Snapshot</Button>
                </ButtonGroup>
              </Toolbar>
            </AppBar>
            {snapshots.length > 1 ? (
              <GridList>
                {snapshots.map((snapshot, i) => (
                  <GridListTile
                    key={i}
                    className={classes.gridListTile}
                    cols={1}
                    rows={1}
                  >
                    <PreviewItem snapshotInfo={snapshot} />
                  </GridListTile>
                ))}
              </GridList>
            ) : (
              <PreviewItem snapshotInfo={snapshots[0]} />
            )}
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
};

PreviewDialog.displayName = 'PreviewDialog';

export { PreviewDialog };
