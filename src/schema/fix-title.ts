import { z } from 'zod';

import { storyDataSchema } from './story';

export const fixScreenshotFileNameInputSchema = storyDataSchema.extend({
  previousNamedExport: z.string().optional(),
});

export type FixScreenshotFileNameInput = z.infer<typeof fixScreenshotFileNameInputSchema>;
