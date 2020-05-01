import { saveScreenshot as saveScreenshotService } from '../services/save-snapshot-data';
import { SaveScreenshot } from '../../../typings';

export const saveScreenshot = async (req, res): Promise<void> => {
  const reqData = req.body as SaveScreenshot;
  try {
    await saveScreenshotService(reqData);
    res.status(200);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
