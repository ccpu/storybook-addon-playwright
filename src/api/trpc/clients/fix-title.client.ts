import type { RouterInput, RouterOutput } from '../router';
import { createTrpcHttpClient } from '../client';

const client = createTrpcHttpClient();

export const fixScreenshotFileName = (
  input: RouterInput['fixTitle']['fixScreenshotFileName'],
): Promise<RouterOutput['fixTitle']['fixScreenshotFileName']> =>
  client.fixTitle.fixScreenshotFileName.mutate(input);
