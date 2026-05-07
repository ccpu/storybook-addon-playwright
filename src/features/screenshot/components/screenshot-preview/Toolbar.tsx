import type { BrowserTypes } from '../../../../typings';
import { Tooltip } from '@material-ui/core';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import NearMeIcon from '@material-ui/icons/NearMe';
import RefreshSharp from '@material-ui/icons/RefreshSharp';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';
import { IconButton } from '@storybook/components';
import React, { useCallback } from 'react';
import { ClipperButton } from '../../../../components/Clipper/ClipperButton';
import { Toolbar as CommonToolbar } from '../../../../components/common';
import { BrowserIconButton } from '../../../../components/common/BrowserIconButton';
import { ResizeBrowserToPreview } from '../../../../components/ResizeBrowserToPreview/ResizeBrowserToPreview';
import { useBrowserOptions } from '../../../../hooks/use-browser-options';
import { BrowserOptions } from './BrowserOptions';
import { ResetSettings } from './ResetSettings';
import { ScreenshotOptions } from './ScreenshotOptions';

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

        <ResizeBrowserToPreview />

        <IconButton onClick={onSave}>
          <Tooltip placement="top" title="Save screenshots">
            <SaveIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={onRefresh}>
          <Tooltip placement="top" title="Refresh">
            <RefreshSharp />
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
