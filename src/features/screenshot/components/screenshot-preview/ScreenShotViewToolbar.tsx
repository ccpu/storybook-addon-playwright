import type { BrowserTypes } from '../../../../typings';
import { CircularProgress, makeStyles, Tooltip } from '@material-ui/core';
import Fullscreen from '@material-ui/icons/FullscreenSharp';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';
import { IconButton } from '@storybook/components';
import React from 'react';
import { resolveMuiIcon } from '../../../../utils/resolve-mui-icon';
import { BrowserOptions } from './BrowserOptions';

const FullscreenIcon = resolveMuiIcon(Fullscreen);
const RefreshOutlinedIcon = resolveMuiIcon(RefreshIcon);
const SaveAltOutlinedIcon = resolveMuiIcon(SaveIcon);

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    label: {
      textTransform: 'uppercase',
    },

    root: {
      alignItems: 'center',
      backgroundColor: palette.divider,
      color: palette.text.secondary,
      display: 'flex',
      flexWrap: 'nowrap',
      fontSize: 14,
      height: 30,
      justifyContent: 'space-between',
      minHeight: 'auto',
      paddingLeft: 10,
      paddingRight: 10,
      textAlign: 'right',
    },

    toolbarPanels: {
      '& button': {
        alignItems: 'center',
        display: 'flex',
        height: 30,
        marginLeft: 6,
        marginTop: 0,
      },
      '& svg:not(.browser-loader)': {
        width: 17,
      },
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
  onFullScreen: () => void;
}

const ScreenShotViewToolbar: React.FC<PreviewItemProps> = (props) => {
  const { browserType, onSave, showSaveButton, loading, onRefresh, onFullScreen } = props;

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
        {showSaveButton && (
          <IconButton onClick={onSave}>
            <Tooltip placement="top" title="Save screenshot">
              <SaveAltOutlinedIcon />
            </Tooltip>
          </IconButton>
        )}
        <IconButton onClick={onRefresh}>
          <Tooltip placement="top" title="Refresh">
            <RefreshOutlinedIcon />
          </Tooltip>
        </IconButton>
        {browserType !== 'storybook' && <BrowserOptions browserType={browserType} />}

        <IconButton onClick={onFullScreen}>
          <Tooltip placement="top" title="Full screen">
            <FullscreenIcon />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

ScreenShotViewToolbar.displayName = 'ScreenShotViewToolbar';

export { ScreenShotViewToolbar };
