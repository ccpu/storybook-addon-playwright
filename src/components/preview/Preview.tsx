import React, { SFC } from 'react';
import { API } from '@storybook/api';

export interface PreviewProps {
  api: API;
}

const Preview: SFC<PreviewProps> = (props) => {
  const { children } = props;

  return (
    <div>
      <div>Preview addon</div>
      <div>{children}</div>
    </div>
  );
};

Preview.displayName = 'Preview';

export { Preview };
