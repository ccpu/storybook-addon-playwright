import type { RouterInput, RouterOutput } from '../router';
import { trpc } from '../client';

export const fixScreenshotFileName = (
  input: RouterInput['fixTitle']['fixScreenshotFileName'],
): Promise<RouterOutput['fixTitle']['fixScreenshotFileName']> =>
  trpc.fixTitle.fixScreenshotFileName.mutate(input);
