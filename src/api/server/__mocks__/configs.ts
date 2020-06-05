import { defaultConfigs } from '../../../../__test_data__/configs';

const getConfigs = jest.fn();

getConfigs.mockImplementation(() => {
  return defaultConfigs();
});

export { getConfigs };
