import { z } from 'zod';
import { router, baseProcedure } from '../../trpc/trpc';
import { fixScreenshotFileName } from './fix-title.service';

export const fixTitleRouter = router({
  // mutation: renames files on disk
  fixScreenshotFileName: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => fixScreenshotFileName(input)),
});
