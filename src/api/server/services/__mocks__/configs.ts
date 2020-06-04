import * as config from '../../configs';
import fs from 'fs';
import path from 'path';
import { Config } from '../../../../typings';

export const defaultConfigs = (config?: Partial<Config>): Config => {
  return {
    customActionSchema: {
      clickSelector: {
        properties: {
          selector: {
            type: 'string',
          },
        },
        type: 'null',
      },
    },
    getPage: async () => {
      return {
        goto: () => {
          return new Promise((resolve) => {
            resolve();
          });
        },
        screenshot: async () => {
          const imagePath = path.join(
            __dirname,
            '../../../../../__test_data__/assets/test-image-snap.png',
          );
          const buffer = fs.readFileSync(imagePath);
          return buffer;
        },
      };
    },
    storybookEndpoint: 'localhost:5000',
    ...(config as Config),
  };
};

export const spyOnGetConfig = jest
  .spyOn(config, 'getConfigs')
  .mockImplementation(() => {
    return defaultConfigs();
  });
