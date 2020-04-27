import React, { SFC, Fragment } from 'react';
import { FlexBar } from '@storybook/components';
import { makeStyles, Theme } from '@material-ui/core';
import { BrowserTypes } from '../../typings';
import { BrowserIcon } from './BrowserIcon';

const useStyles = makeStyles(
  (theme: Theme) => {
    return {
      root: {
        boxShadow: theme.palette.divider + ' 0 1px 0 0 inset',
      },
    };
  },
  { name: 'Toolbar' },
);

export interface ToolbarProps {
  browserTypes: BrowserTypes[];
  activeBrowsers: BrowserTypes[];
  toggleBrowser: (type: BrowserTypes) => void;
}

const Toolbar: SFC<ToolbarProps> = (props) => {
  const { browserTypes, toggleBrowser, activeBrowsers } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FlexBar>
        <Fragment key="left">
          {browserTypes.map((browserType) => (
            <BrowserIcon
              key={browserType}
              browserType={browserType}
              onClick={toggleBrowser}
              active={
                activeBrowsers.find((x) => x === browserType) !== undefined
              }
            />
          ))}
        </Fragment>
      </FlexBar>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
