import { Tooltip } from '@mui/material';
import AspectRatioIconIconModule from '@mui/icons-material/AspectRatio';
import { IconButton } from '@storybook/components';
import React from 'react';
import { useBrowserOptions, useScreenshotOptions } from '../../hooks';
import { getIframeInnerSize, getPreviewIframe } from '../../utils';
import { resolveMuiIcon } from '../../utils/resolve-mui-icon';

const AspectRatioIcon = resolveMuiIcon(AspectRatioIconIconModule);

const ResizeBrowserToIframeContent: React.FC = () => {
  const { setBrowserOptions, browserOptions } = useBrowserOptions();
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const handleClick = React.useCallback(() => {
    const iframe = getPreviewIframe();
    if (!iframe) {
      return;
    }

    const innerSize = getIframeInnerSize(iframe);
    if (!innerSize) {
      return;
    }

    setBrowserOptions('all', {
      ...browserOptions.all,
      viewport: {
        height: Math.round(innerSize.height),
        width: Math.round(innerSize.width),
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
    <IconButton
      onClick={handleClick}
      aria-label="Match browser viewport to iframe content"
    >
      <Tooltip placement="top" title="Match browser viewport to iframe content">
        <AspectRatioIcon />
      </Tooltip>
    </IconButton>
  );
};

ResizeBrowserToIframeContent.displayName = 'ResizeBrowserToIframeContent';

export { ResizeBrowserToIframeContent };
