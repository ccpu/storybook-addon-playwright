import { makeScreenshot } from '../services/make-screenshot';
import { GetScreenshotRequest, GetScreenshotResponse } from '../../../typings';

export const getScreenshot = async (req, res) => {
  const reqData = req.body as GetScreenshotRequest;
  try {
    const snapshotData = await makeScreenshot(reqData, req.headers.host, true);
    res.send(
      JSON.stringify({ base64: snapshotData.base64 } as GetScreenshotResponse),
    );
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
