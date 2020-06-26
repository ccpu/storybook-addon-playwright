import { getOptions } from 'loader-utils';
import { toRequireContextString } from '@storybook/core/dist/server/preview/to-require-context';

module.exports = function parentScopeLoader() {
  const options = getOptions(this);

  const cont = `window.__playwright_addon_required_context__= [${options.stories
    .map(toRequireContextString)
    .join(',')}];window.__playwright_addon_hot_reload_time__=${Date.now()}`;

  return cont;
};
