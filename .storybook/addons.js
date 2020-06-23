import '../register';
import '@storybook/addon-knobs/register';
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
});
