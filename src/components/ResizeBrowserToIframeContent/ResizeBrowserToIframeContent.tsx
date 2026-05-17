import { Tooltip } from '@material-ui/core';
import PhotoSizeSelectLargeIconModule from '@material-ui/icons/PhotoSizeSelectLarge';
import { IconButton } from '@storybook/components';
import React from 'react';
import { useBrowserOptions, useScreenshotOptions } from '../../hooks';
import { getPreviewIframe } from '../../utils';
import { resolveMuiIcon } from '../../utils/resolve-mui-icon';

const PhotoSizeSelectLargeIcon = resolveMuiIcon(PhotoSizeSelectLargeIconModule);

function getIframeInnerSize(iframe: HTMLIFrameElement) {
  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument || !iframeDocument.body || !iframeDocument.documentElement) {
    return null;
  }

  const { body, documentElement } = iframeDocument;

  const width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    body.clientWidth,
    documentElement.scrollWidth,
    documentElement.offsetWidth,
    documentElement.clientWidth,
  );

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    body.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight,
    documentElement.clientHeight,
  );

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { width, height };
}

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
        <PhotoSizeSelectLargeIcon />
      </Tooltip>
    </IconButton>
  );
};

ResizeBrowserToIframeContent.displayName = 'ResizeBrowserToIframeContent';

export { ResizeBrowserToIframeContent };
