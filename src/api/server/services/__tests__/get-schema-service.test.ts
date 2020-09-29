import { getSchemaService } from '../get-schema-service';
import path from 'path';

jest.mock('../../configs');

const file = path.resolve('./src/api/server/services/typings/app-types.ts');

describe('getSchemaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate PlaywrightScreenshotOptionSchema schema', () => {
    const schema = getSchemaService({
      path: file,
      type: 'PlaywrightScreenshotOptionSchema',
    });
    expect(schema).toMatchSnapshot();
  });

  it('should generate PlaywrightBrowserContextOptionSchema schema', () => {
    const schema = getSchemaService({
      path: file,
      type: 'PlaywrightBrowserContextOptionSchema',
    });
    expect(schema).toMatchSnapshot();
  });
});
