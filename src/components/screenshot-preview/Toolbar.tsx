import React, { SFC, useCallback } from 'react';
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
import NearMeIcon from '@material-ui/icons/NearMe';

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

  const enableDisableCursor = useCallback(() => {
    setScreenshotOptions({
      ...(screenshotOptions ? screenshotOptions : {}),
      cursor: !screenshotOptions
        ? true
        : screenshotOptions.cursor
        ? undefined
        : true,
    });
  }, [screenshotOptions, setScreenshotOptions]);

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
        <IconButton
          className="cursor-button"
          onClick={enableDisableCursor}
          active={screenshotOptions && screenshotOptions.cursor}
        >
          <Tooltip
            placement="top"
            title={
              screenshotOptions && screenshotOptions.cursor
                ? `Hide cursor`
                : `Show cursor`
            }
          >
            <NearMeIcon style={{ transform: 'rotate(-80deg)' }} />
          </Tooltip>
        </IconButton>
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
