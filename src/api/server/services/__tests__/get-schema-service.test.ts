import { getSchemaService } from '../get-schema-service';

describe('getSchemaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate PlaywrightScreenshotOptionSchema schema', () => {
    const schema = getSchemaService('browser-options');
    expect(schema).toBeDefined();
  });

  it('should generate PlaywrightBrowserContextOptionSchema schema', () => {
    const schema = getSchemaService('screenshot-options');
    expect(schema).toBeDefined();
  });

  it('should return nothing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema = getSchemaService('invalid' as any);
    expect(schema).not.toBeDefined();
  });
});
