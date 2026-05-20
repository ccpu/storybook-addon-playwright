import { getClientConfig } from '../../../src/api/services/get-client-config';
import { getConfigs } from '../../../src/api/server/configs';

vi.mock('../../../src/api/server/configs');

describe('getClientConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns default selector attributes when not configured', () => {
    (getConfigs as Mock).mockReturnValue({});

    expect(getClientConfig()).toEqual({ selectorAttributeNames: ['id'] });
  });

  it('normalizes configured selector attributes', () => {
    (getConfigs as Mock).mockReturnValue({
      selectorAttributeNames: [' data-slot ', 'data-testid', 'id', 'data-slot', ''],
    });

    expect(getClientConfig()).toEqual({
      selectorAttributeNames: ['data-slot', 'data-testid', 'id'],
    });
  });
});
