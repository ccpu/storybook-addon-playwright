import React from 'react';
import { IconButton } from '@storybook/components';
import { Tooltip } from '@material-ui/core';
import { getPreviewIframe } from '../../utils';
import { useBrowserOptions, useScreenshotOptions } from '../../hooks';

const ResizeBrowserToPreview: React.FC = () => {
  const { setBrowserOptions, browserOptions } = useBrowserOptions();
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const handleClick = React.useCallback(() => {
    const iframe = getPreviewIframe();
    if (iframe) {
      const iframeRect = iframe.getBoundingClientRect();

      setBrowserOptions('all', {
        ...browserOptions,
        viewport: {
          height: Math.round(iframeRect.height),
          width: Math.round(iframeRect.width),
        },
      });
      setScreenshotOptions({
        ...screenshotOptions,
        clip: undefined,
      });
    }
  }, [
    browserOptions,
    screenshotOptions,
    setBrowserOptions,
    setScreenshotOptions,
  ]);

  return (
    <IconButton onClick={handleClick}>
      <Tooltip
        placement="top"
        title={'Adjust the browser size to match the preview.'}
      >
        <svg
          className="MuiSvgIcon-root"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          style={{
            height: 20,
            transform: 'rotate(180deg)',
            width: 20,
          }}
        >
          <path d="M17 4h3c1.1 0 2 .9 2 2v2h-2V6h-3V4zM4 8V6h3V4H4c-1.1 0-2 .9-2 2v2h2zm16 8v2h-3v2h3c1.1 0 2-.9 2-2v-2h-2zM7 18H4v-2H2v2c0 1.1.9 2 2 2h3v-2zM18 8H6v8h12V8z"></path>{' '}
        </svg>
      </Tooltip>
    </IconButton>
  );
};

ResizeBrowserToPreview.displayName = 'ResizeBrowserToPreview';

export { ResizeBrowserToPreview };
