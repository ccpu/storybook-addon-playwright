import { getIframe } from '../utils';
import { getStoryFunction } from './get-story-function';

interface RequiredContext {
  __playwright_addon_required_context__: () =>
    | unknown
    | {
        resolve: (id: string) => string | undefined;
      }[];
}

export function getStoryFilePath(path: string, storyId: string) {
  const iframeWindow = (getIframe()
    .contentWindow as unknown) as RequiredContext;
  const requiredContext = iframeWindow.__playwright_addon_required_context__;

  const storyFunc = getStoryFunction(storyId);

  if (storyFunc) {
    const storyFuncName = storyFunc.name;

    for (let index = 0; index < requiredContext.length; index++) {
      const req = requiredContext[index];
      try {
        const relativePath = req.resolve(path);

        const fileExports = req(path);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { default: meta, ...namedExports } = fileExports;

        const exportNames = Object.keys(namedExports);

        if (exportNames.indexOf(storyFuncName) === -1) continue;

        if (namedExports[storyFuncName] !== storyFunc) continue;

        return relativePath;
      } catch {
        //
      }
    }
  }

  console.warn(
    `Unable to detect the relative path of '${path}' for stories of id '${storyId}'`,
  );

  return undefined;
}
