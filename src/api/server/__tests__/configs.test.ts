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

  it('should have default concurrencyLimit', () => {
    expect(getConfigs().concurrencyLimit).toStrictEqual({ file: 1, story: 1 });
  });

  it('should apply file concurrencyLimit', () => {
    setConfig({
      concurrencyLimit: {
        file: 100,
      },
      getPage: jest.fn(),
      storybookEndpoint: 'localhost:3000',
    });
    expect(getConfigs().concurrencyLimit).toStrictEqual({
      file: 100,
      story: 1,
    });
  });

  it('should apply story concurrencyLimit', () => {
    setConfig({
      concurrencyLimit: {
        story: 100,
      },
      getPage: jest.fn(),
      storybookEndpoint: 'localhost:3000',
    });
    expect(getConfigs().concurrencyLimit).toStrictEqual({
      file: 1,
      story: 100,
    });
  });

  it('should apply concurrencyLimit', () => {
    setConfig({
      concurrencyLimit: {
        file: 100,
        story: 100,
      },
      getPage: jest.fn(),
      storybookEndpoint: 'localhost:3000',
    });
    expect(getConfigs().concurrencyLimit).toStrictEqual({
      file: 100,
      story: 100,
    });
  });
});
