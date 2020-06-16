import { setConfig, getConfigs } from '../configs';

describe('config', () => {
  it('should throw error if config not set', () => {
    expect(() => getConfigs()).toThrowError('Configuration has not been set.');
  });
  it('should set config', () => {
    setConfig({ getPage: jest.fn(), storybookEndpoint: 'localhost:3000' });
    expect(getConfigs()).toBeDefined();
  });
});
