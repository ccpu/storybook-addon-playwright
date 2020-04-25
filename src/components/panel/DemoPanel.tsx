import React, { SFC } from 'react';
import { API } from '@storybook/api';
// import { RenderOptions } from '@storybook/addons';
// import { AddonPanel } from '@storybook/components';

interface DemoPanelProps {
  api: API;
}

const DemoPanel: SFC<DemoPanelProps> = (_props) => {
  // const { active, key } = props;
  return <div>add on panel</div>;
};

DemoPanel.displayName = 'DemoPanel';

export { DemoPanel };
