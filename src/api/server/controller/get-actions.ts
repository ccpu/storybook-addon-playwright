import { getSnapshotHelper } from '../setup-snapshot';

export const getActions = async (_req, res) => {
  try {
    const helper = getSnapshotHelper();
    res.send(JSON.stringify(helper.actions));
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
