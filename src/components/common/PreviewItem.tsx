import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import { SnapshotInfo } from '../../typings';
import { Card, Divider } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  button: {
    position: 'relative',
  },
  buttons: {
    padding: 2,
    textAlign: 'right',
  },
  container: {
    height: '100%',
    overflow: 'scroll',
    width: '100%',
  },
  dialogPaper: {
    maxHeight: '95%',
    maxWidth: '95%',
    minHeight: '95%',
    minWidth: '95%',
    overflow: 'hidden',
  },
  imageContainer: {
    margin: 2,
    width: '50%',
    // width: '50%',
  },
  labelContainer: {
    // bottom: 20,
    // position: 'absolute',
    // right: 20,
    textAlign: 'center',
  },
  progress: {
    left: -3,
    position: 'absolute',
    top: 7,
    zIndex: 1,
  },
}));

export interface PreviewItemProps {
  snapshotInfo: SnapshotInfo;
}

const PreviewItem: SFC<PreviewItemProps> = (props) => {
  const { snapshotInfo } = props;
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <div className={classes.labelContainer}>
        <label>{snapshotInfo.browserName}</label>
      </div>
      <Divider />
      <img src={`data:image/gif;base64,${snapshotInfo.base64}`} />
    </Card>
  );
};

PreviewItem.displayName = 'PreviewItem';

export { PreviewItem };
