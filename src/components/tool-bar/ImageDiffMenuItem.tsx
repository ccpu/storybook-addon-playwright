import React, { forwardRef, Ref, useCallback } from 'react';
import { ImageDiffResult } from '../../api/typings';
import { MenuItem } from '@material-ui/core';
import { useStorybookApi } from '@storybook/api';
import { SCREENSHOT_PANEL_ID } from '../../constants';

export interface ImageDiffMenuItemProps {
  imageDiff: ImageDiffResult;
  onClick: () => void;
}

const ImageDiffMenuItem: React.FC<ImageDiffMenuItemProps> = forwardRef(
  (props, ref: Ref<HTMLLIElement>) => {
    const { imageDiff, onClick } = props;

    const api = useStorybookApi();

    const data = api.getData(imageDiff.storyId);

    const handleLoadStory = useCallback(() => {
      onClick();
      api.selectStory(imageDiff.storyId);
      api.setSelectedPanel(SCREENSHOT_PANEL_ID);
    }, [api, imageDiff.storyId, onClick]);

    if (!data) {
      return null;
    }

    return (
      <MenuItem onClick={handleLoadStory} ref={ref}>
        {data.parent + '--' + data.name}
      </MenuItem>
    );
  },
);

ImageDiffMenuItem.displayName = 'ImageDiffMenuItem';

export { ImageDiffMenuItem };
