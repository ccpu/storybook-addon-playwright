import { getSnapshot } from '../services/get-snapshot';
import { SnapshotInfo } from '../../../typings';

type GetSnapShot = Pick<SnapshotInfo, 'browserName' | 'base64'>;

export const getSnapShot = async (req, res) => {
  const story = req.body;
  try {
    const snapshotData = await getSnapshot(story, req.headers.host, true);

    const snapshotBase64 = snapshotData.map((snap) => {
      return {
        base64: snap.base64,
        browserName: snap.browserName,
      } as GetSnapShot;
    });

    res.send(JSON.stringify(snapshotBase64));
    res.end();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
