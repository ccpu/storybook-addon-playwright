import { defaultConfigs } from '../../../configs/configs';
import { getConfigs as orgGetConfigs } from '../../../../src/api/server/configs';

const getConfigs = vi.fn<typeof orgGetConfigs>();

getConfigs.mockImplementation(() => {
  return defaultConfigs();
});

export { getConfigs };
