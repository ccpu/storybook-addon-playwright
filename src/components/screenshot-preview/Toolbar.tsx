import React, { SFC } from 'react';
import { IconButton } from '@storybook/components';
import { BrowserTypes } from '../../typings';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { Toolbar as CommonToolbar } from '../common';
import RefreshSharp from '@material-ui/icons/RefreshSharp';
import { BrowserIconButton } from '../common/BrowserIconButton';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';
import { ScreenshotOptionsPopover } from './ScreenshotOptionsPopover';
import { useScreenshotOptions } from '../../hooks';
import { Tooltip } from '@material-ui/core';

export interface ToolbarProps {
  browserTypes: BrowserTypes[];
  activeBrowsers: BrowserTypes[];
  toggleBrowser: (type: BrowserTypes) => void;
  onCLose: () => void;
  onRefresh: () => void;
  onSave?: () => void;
}

const Toolbar: SFC<ToolbarProps> = (props) => {
  const {
    browserTypes,
    toggleBrowser,
    activeBrowsers,
    onCLose,
    onRefresh,
    onSave,
  } = props;

  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

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
      </div>
      <div className="right">
        <IconButton onClick={onRefresh}>
          <Tooltip placement="top" title="Refresh">
            <RefreshSharp />
          </Tooltip>
        </IconButton>
        <IconButton onClick={onSave}>
          <Tooltip placement="top" title="Save screenshots">
            <SaveIcon />
          </Tooltip>
        </IconButton>

        <ScreenshotOptionsPopover
          onChange={setScreenshotOptions}
          options={screenshotOptions}
        />
        <IconButton onClick={onCLose}>
          <Tooltip placement="top" title="Close panel">
            <CloseOutlined />
          </Tooltip>
        </IconButton>
      </div>
    </CommonToolbar>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
