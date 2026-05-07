import { fixScreenshotFileNameInputSchema } from '../../../schema';
import { fixScreenshotFileName } from '../../services/fix-screenshot-file-name';
import { baseProcedure, router } from '../trpc';

export const fixTitleRouter = router({
  // mutation: renames files on disk
  fixScreenshotFileName: baseProcedure
    .input(fixScreenshotFileNameInputSchema)
    .mutation(async ({ input }) => fixScreenshotFileName(input)),
});
