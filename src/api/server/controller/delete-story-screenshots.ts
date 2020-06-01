import { StoryInfo } from '../../../typings';
import { deleteStoryScreenshots as deleteStoryScreenshotsService } from '../services/delete-story-screenshots';

export const deleteStoryScreenshot = async (req, res): Promise<void> => {
  const reqData = req.body as StoryInfo;
  await deleteStoryScreenshotsService(reqData);
  res.status(200);
  res.end();
};
