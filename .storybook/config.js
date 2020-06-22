import { configure } from '@storybook/react';

configure(
  require.context(
    '../stories',
    true,
    /^\.\/((?!node_modules).)*\.stories\.(tsx|ts|js|jsx|mdx)$/,
  ),
  module,
);
