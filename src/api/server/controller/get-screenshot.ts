import { makeScreenshot } from '../services/make-screenshot';
import { ScreenshotRequestData } from '../../../typings';

export const getScreenshot = async (req, res) => {
  const reqData = req.body as ScreenshotRequestData;
  try {
    const snapshotData = await makeScreenshot(reqData, req.headers.host, true);
    res.send(JSON.stringify(snapshotData.base64));
    res.end();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
