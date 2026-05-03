import { router, baseProcedure } from '../trpc';
import { fixScreenshotFileName } from '../../services/fix-screenshot-file-name';
import { fixScreenshotFileNameInputSchema } from '../../../schema';

export const fixTitleRouter = router({
  // mutation: renames files on disk
  fixScreenshotFileName: baseProcedure
    .input(fixScreenshotFileNameInputSchema)
    .mutation(({ input }) => fixScreenshotFileName(input)),
});
