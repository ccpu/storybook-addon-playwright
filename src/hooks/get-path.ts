import { getIframe } from '../utils';

/* eslint-disable @typescript-eslint/no-var-requires */
export function getPath(path: string, kind: string) {
  // return require('get-story-relative-path');
  // return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const moduleFoo = getIframe().contentWindow.__stories__required_context__ as {
    resolve: (id: string) => string | undefined;
  }[];
  // console.log(moduleFoo.map((x) => x.resolve));
  // console.log((document as any).__stories__required_context__);
  // return;

  const relativePath = moduleFoo.find((x) => {
    try {
      const p = x.resolve(path);
      const moduleKind = (x as any)(path)['default'].title;
      // console.log(x.resolve);
      if (p && moduleKind === kind) return p;
      return undefined;
    } catch (error) {
      console.error(
        `Unable to detect filename for stories of kind "${kind}"\n` +
          error.message,
      );
      return undefined;
    }
  });

  if (!relativePath) return undefined;

  // console.log(relativePath);
  return relativePath.resolve(path);
  // return moduleFoo.resolve(path);

  // console.log(require.context(inp.path, inp.recursive, inp.match));
}
