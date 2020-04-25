import React, { SFC, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { IconButton } from '@storybook/components';
import { useKnobs } from '../../hooks';
import { API } from '@storybook/api';
import { getSnapShots } from '../../api/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { SnapshotInfo } from '../../typings';
import { ThemeProvider, PreviewDialog } from '../common';

const useStyles = makeStyles(() => ({
  button: {
    position: 'relative',
  },
  progress: {
    left: -3,
    position: 'absolute',
    top: 7,
    zIndex: 1,
  },
}));

export interface ToolProps {
  api?: API;
}

const Tool: SFC<ToolProps> = (props) => {
  const { api } = props;

  const [open, setOpen] = React.useState(false);
  const [working, setWorking] = useState(false);
  const [snapshots, setSnapshots] = useState<SnapshotInfo[] | string>();

  const knobs = useKnobs(api);

  const handleOpen = () => {
    setWorking(true);
    getSnapShots(api, knobs).then((snapShotsInfo) => {
      setOpen(true);
      setWorking(false);
      setSnapshots(snapShotsInfo);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  return (
    <ThemeProvider>
      <IconButton
        onClick={handleOpen}
        key="tool"
        title="snapshot"
        className={classes.button}
        disabled={working}
      >
        <Icon />
        {working && <CircularProgress size={21} className={classes.progress} />}
      </IconButton>
      <PreviewDialog open={open} onClose={handleClose} snapshots={snapshots} />
    </ThemeProvider>
  );
};

Tool.displayName = 'Tool';

export { Tool };
