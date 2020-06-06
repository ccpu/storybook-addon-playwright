import React, { SFC } from 'react';
import { IconButton } from '@storybook/components';
import { BrowserTypes } from '../../typings';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { Toolbar as CommonToolbar } from '../common';
import RefreshSharp from '@material-ui/icons/RefreshSharp';
import { BrowserIconButton } from '../common/BrowserIconButton';

export interface ToolbarProps {
  browserTypes: BrowserTypes[];
  activeBrowsers: BrowserTypes[];
  toggleBrowser: (type: BrowserTypes) => void;
  onCLose: () => void;
  onRefresh: () => void;
}

const Toolbar: SFC<ToolbarProps> = (props) => {
  const {
    browserTypes,
    toggleBrowser,
    activeBrowsers,
    onCLose,
    onRefresh,
  } = props;

  return (
    <CommonToolbar border={['top']}>
      <div className="left">
        {browserTypes.map((browserType) => (
          <BrowserIconButton
            key={browserType}
            browserType={browserType}
            onClick={toggleBrowser}
            active={activeBrowsers.find((x) => x === browserType) !== undefined}
          />
        ))}
        <IconButton onClick={onRefresh}>
          <RefreshSharp />
        </IconButton>
      </div>
      <div className="right">
        <IconButton onClick={onCLose}>
          <CloseOutlined />
        </IconButton>
      </div>
    </CommonToolbar>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
