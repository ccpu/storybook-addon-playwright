import { Tooltip } from '@mui/material';
import FitScreenIconModule from '@mui/icons-material/FitScreen';
import { IconButton } from '@storybook/components';
import React from 'react';
import { useBrowserOptions, useScreenshotOptions } from '../../hooks';
import { getPreviewIframe } from '../../utils';
import { resolveMuiIcon } from '../../utils/resolve-mui-icon';

const FitScreenIcon = resolveMuiIcon(FitScreenIconModule);

const ResizeBrowserToPreview: React.FC = () => {
  const { setBrowserOptions, browserOptions } = useBrowserOptions();
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const handleClick = React.useCallback(() => {
    const iframe = getPreviewIframe();
    if (!iframe) {
      return;
    }

    const iframeRect = iframe.getBoundingClientRect();

    setBrowserOptions('all', {
      ...browserOptions.all,
      viewport: {
        height: Math.round(iframeRect.height),
        width: Math.round(iframeRect.width),
      },
    });

    if (screenshotOptions && screenshotOptions.clip !== undefined) {
      setScreenshotOptions({
        ...screenshotOptions,
        clip: undefined,
      });
    }
  }, [browserOptions, screenshotOptions, setBrowserOptions, setScreenshotOptions]);

  return (
    <IconButton onClick={handleClick} aria-label="Match browser viewport to preview">
      <Tooltip placement="top" title="Match browser viewport to preview">
        <FitScreenIcon />
      </Tooltip>
    </IconButton>
  );
};

ResizeBrowserToPreview.displayName = 'ResizeBrowserToPreview';

export { ResizeBrowserToPreview };
