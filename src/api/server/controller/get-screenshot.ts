import { makeScreenshot } from '../services/make-screenshot';
import { ScreenshotRequestData, ScreenshotResponse } from '../../../typings';

export const getScreenshot = async (req, res) => {
  const reqData = req.body as ScreenshotRequestData;
  try {
    const snapshotData = await makeScreenshot(reqData, req.headers.host, true);
    res.send(
      JSON.stringify({ base64: snapshotData.base64 } as ScreenshotResponse),
    );
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
