import React, { SFC } from 'react';
import { ListItemWrapperProps, ListItemWrapper } from '../common';

const ScreenshotListItemWrapper: SFC<ListItemWrapperProps> = ({
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
