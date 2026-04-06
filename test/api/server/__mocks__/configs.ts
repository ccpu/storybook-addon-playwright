import { defaultConfigs } from '../../../configs/configs';

const getConfigs = vi.fn();

getConfigs.mockImplementation(() => {
  return defaultConfigs();
});

export { getConfigs };
