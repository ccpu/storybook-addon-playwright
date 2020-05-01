import React, { SFC, Fragment } from 'react';
import { IconButton } from '@storybook/components';
import { BrowserTypes } from '../../typings';
import { BrowserIcon } from './BrowserIcon';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { Toolbar as CommonToolbar } from '../common';

export interface ToolbarProps {
  browserTypes: BrowserTypes[];
  activeBrowsers: BrowserTypes[];
  toggleBrowser: (type: BrowserTypes) => void;
  onCLose: () => void;
}

const Toolbar: SFC<ToolbarProps> = (props) => {
  const { browserTypes, toggleBrowser, activeBrowsers, onCLose } = props;

  return (
    <CommonToolbar border={['top']}>
      <Fragment key="left">
        {browserTypes.map((browserType) => (
          <BrowserIcon
            key={browserType}
            browserType={browserType}
            onClick={toggleBrowser}
            active={activeBrowsers.find((x) => x === browserType) !== undefined}
          />
        ))}
      </Fragment>
      <Fragment key="right">
        <IconButton onClick={onCLose}>
          <CloseOutlined />
        </IconButton>
      </Fragment>
    </CommonToolbar>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
