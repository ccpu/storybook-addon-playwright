import { trpc } from '../../trpc/client';
import type { RouterInput, RouterOutput } from '../../trpc/router';

export const fixScreenshotFileName = (
  input: RouterInput['fixTitle']['fixScreenshotFileName'],
): Promise<RouterOutput['fixTitle']['fixScreenshotFileName']> =>
  trpc.fixTitle.fixScreenshotFileName.mutate(input);
