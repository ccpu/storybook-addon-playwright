import { Config } from 'ts-to-json';
import { generateSchema } from './generate-schema';

export const getSchemaService = (config: Partial<Config>) => {
  return generateSchema(config);
};
