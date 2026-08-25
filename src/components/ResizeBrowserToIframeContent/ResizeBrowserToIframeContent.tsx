import { AspectRatio as AspectRatioIconIconModule } from '../../icons';
import { IconButton } from 'storybook/internal/components';
import React from 'react';

import { useBrowserOptions, useScreenshotOptions } from '../../hooks';
import { getIframeInnerSize, getPreviewIframe } from '../../utils';

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
      title="Match browser viewport to iframe content"
    >
      <AspectRatioIconIconModule />
    </IconButton>
  );
};

ResizeBrowserToIframeContent.displayName = 'ResizeBrowserToIframeContent';

export { ResizeBrowserToIframeContent };
