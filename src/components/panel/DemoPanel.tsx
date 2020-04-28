import React, { SFC } from 'react';
import { API } from '@storybook/api';
import { useActionData } from '../../hooks';

interface DemoPanelProps {
  api: API;
}

const DemoPanel: SFC<DemoPanelProps> = (_props) => {
  const actions = useActionData();
  console.log(actions);
  // const { active, key } = props;
  return <div>add on panel</div>;
};

DemoPanel.displayName = 'DemoPanel';

export { DemoPanel };
