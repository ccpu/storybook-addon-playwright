import { defaultConfigs } from '../../../../__test_data__/configs';

const getConfigs = vi.fn();

getConfigs.mockImplementation(() => {
  return defaultConfigs();
});

export { getConfigs };
