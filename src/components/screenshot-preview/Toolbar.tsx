import React, { useCallback } from 'react';
import { IconButton } from '@storybook/components';
import { BrowserTypes } from '../../typings';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { Toolbar as CommonToolbar } from '../common';
import RefreshSharp from '@material-ui/icons/RefreshSharp';
import { BrowserIconButton } from '../common/BrowserIconButton';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';
import { useBrowserOptions } from '../../hooks';
import { Tooltip } from '@material-ui/core';
import NearMeIcon from '@material-ui/icons/NearMe';
import { BrowserOptions } from './BrowserOptions';
import { ScreenshotOptions } from './ScreenshotOptions';
import { ClipperButton } from '../Clipper/ClipperButton';
import { ResetSettings } from './ResetSettings';

export interface ToolbarProps {
  browserTypes: BrowserTypes[];
  activeBrowsers: BrowserTypes[];
  toggleBrowser: (type: BrowserTypes) => void;
  onCLose: () => void;
  onRefresh: () => void;
  onSave?: () => void;
  isVertical?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    browserTypes,
    toggleBrowser,
    activeBrowsers,
    onCLose,
    onRefresh,
    isVertical,
    onSave,
  } = props;

  const { setBrowserOptions, browserOptions } = useBrowserOptions();

  const enableDisableCursor = useCallback(() => {
    const enable = browserOptions.all && browserOptions.all.cursor;
    setBrowserOptions('all', {
      ...browserOptions.all,
      cursor: enable ? undefined : true,
    });
  }, [browserOptions, setBrowserOptions]);

  return (
    <CommonToolbar border={isVertical ? undefined : ['top']}>
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
          active={browserOptions.all && browserOptions.all.cursor}
        >
          <Tooltip
            placement="top"
            title={
              browserOptions.all && browserOptions.all.cursor
                ? 'Hide cursor'
                : 'Show cursor'
            }
          >
            <NearMeIcon style={{ transform: 'rotate(-80deg)' }} />
          </Tooltip>
        </IconButton>
        <ClipperButton />
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

        <ResetSettings />

        <ScreenshotOptions />
        <BrowserOptions browserType="all" />

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
