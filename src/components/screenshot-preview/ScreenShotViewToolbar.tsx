import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { BrowserTypes } from '../../typings';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    icons: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
      cursor: 'pointer',
      marginLeft: 5,
      padding: 3,
    },

    label: {
      textTransform: 'uppercase',
    },

    toolbar: {
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
}

const ScreenShotViewToolbar: SFC<PreviewItemProps> = (props) => {
  const { browserType, onSave, showSaveButton, loading, onRefresh } = props;

  const classes = useStyles();

  return (
    <div className={classes.toolbar}>
      <div className={classes.toolbarPanels}>
        <label className={classes.label}>{browserType}</label>
        {loading && <CircularProgress style={{ marginLeft: 10 }} size={15} />}
      </div>
      <div className={classes.toolbarPanels}>
        <RefreshIcon className={classes.icons} onClick={onRefresh} />
        {showSaveButton && (
          <SaveIcon className={classes.icons} onClick={onSave} />
        )}
      </div>
    </div>
  );
};

ScreenShotViewToolbar.displayName = 'ScreenShotViewToolbar';

export { ScreenShotViewToolbar };
