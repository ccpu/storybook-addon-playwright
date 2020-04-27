import React, { SFC, useState } from 'react';
import { IconButton, Separator } from '@storybook/components';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '../common';
import { PreviewDialog } from '../snapshot';
import WebOutlined from '@material-ui/icons/WebOutlined';

import { PreviewPlacementMenu } from './PreviewPlacementMenu';

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

const Tool: SFC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  return (
    <ThemeProvider>
      <Separator />
      <IconButton
        onClick={handleOpen}
        title="Multi view"
        className={classes.button}
      >
        <WebOutlined viewBox="1.5 0 21 21" />
      </IconButton>
      <PreviewPlacementMenu />
      <Separator />
      <PreviewDialog open={open} onClose={handleClose} />
    </ThemeProvider>
  );
};

Tool.displayName = 'Tool';

export { Tool };
