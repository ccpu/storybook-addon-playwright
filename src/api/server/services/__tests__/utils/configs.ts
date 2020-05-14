import { setConfig } from '../../../configs';
import fs from 'fs';
import path from 'path';
import { Config } from '../../../../../typings';

export const setConfigs = (config?: Partial<Config>) => {
  setConfig({
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
            '../../../../../../__test_helper__/assets/test-image-snap.png',
          );
          const buffer = fs.readFileSync(imagePath);
          return buffer;
        },
      };
    },
    storybookEndpoint: 'localhost:5000',
    ...(config as Config),
  });
};
