import { setConfig, getConfigs } from '../configs';
import { migration } from '../migration';

jest.mock('../migration/migration.ts');

describe('config', () => {
  it('should throw error if config not set', () => {
    expect(() => getConfigs()).toThrowError('Configuration has not been set.');
  });
  it('should set config', () => {
    setConfig({ getPage: jest.fn(), storybookEndpoint: 'localhost:3000' });
    expect(getConfigs()).toBeDefined();
  });

  it('should enable migration', () => {
    setConfig({
      enableMigration: true,
      getPage: jest.fn(),
      storybookEndpoint: 'localhost:3000',
    });
    expect(migration).toHaveBeenCalledTimes(1);
  });
});
