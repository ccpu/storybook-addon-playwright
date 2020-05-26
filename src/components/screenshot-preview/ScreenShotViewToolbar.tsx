import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { BrowserTypes } from '../../typings';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';
import { DeviceList } from '../common';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import Fullscreen from '@material-ui/icons/FullscreenSharp';

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    label: {
      textTransform: 'uppercase',
    },

    root: {
      '& svg:not(.browser-loader)': {
        '&:hover': {
          color: theme.palette.primary.main,
        },
        cursor: 'pointer',
        marginLeft: 5,
        padding: 3,
      },
      alignItems: 'center',
      backgroundColor: theme.palette.divider,
      color: palette.text.secondary,
      display: 'flex',
      flexWrap: 'nowrap',
      fontSize: 14,
      height: 30,
      justifyContent: 'space-between',
      minHeight: 'auto',
      paddingRight: 10,
      textAlign: 'right',
    },

    toolbarPanels: {
      alignItems: 'center',
      display: 'flex',
    },
  };
});

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  onSave: () => void;
  loading: boolean;
  showSaveButton: boolean;
  onRefresh: () => void;
  onDeviceSelect: (deviceName: string) => void;
  selectedDevice: string;
  onFullScreen: () => void;
}

const ScreenShotViewToolbar: SFC<PreviewItemProps> = (props) => {
  const {
    browserType,
    onSave,
    showSaveButton,
    loading,
    onRefresh,
    onDeviceSelect,
    selectedDevice,
    onFullScreen,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.toolbarPanels}>
        <label className={classes.label}>{browserType}</label>
        {loading && (
          <CircularProgress
            classes={{
              svg: 'browser-loader',
            }}
            style={{ marginLeft: 10 }}
            size={15}
          />
        )}
      </div>
      <div className={classes.toolbarPanels}>
        <RefreshIcon onClick={onRefresh} />
        {browserType !== 'storybook' && (
          <DeviceList
            onDeviceSelect={onDeviceSelect}
            selectedDevice={selectedDevice}
          />
        )}
        {showSaveButton && <SaveIcon onClick={onSave} />}
        <Fullscreen onClick={onFullScreen} />
      </div>
    </div>
  );
};

ScreenShotViewToolbar.displayName = 'ScreenShotViewToolbar';

export { ScreenShotViewToolbar };
