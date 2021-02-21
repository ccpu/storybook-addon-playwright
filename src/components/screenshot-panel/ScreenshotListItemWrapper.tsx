import React from 'react';
import { ListItemWrapperProps, ListItemWrapper } from '../common';

const ScreenshotListItemWrapper: React.FC<ListItemWrapperProps> = ({
  children,
  ...rest
}) => {
  return (
    <ListItemWrapper
      style={{
        cursor: 'pointer',
      }}
      icons={children}
      {...rest}
    />
  );
};

ScreenshotListItemWrapper.displayName = 'ScreenshotListItemWrapper';

export { ScreenshotListItemWrapper };
