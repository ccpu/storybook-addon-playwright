import { getSchemaService } from '../services/get-schema-service';
import { Request, Response } from 'express';
import { Config } from 'ts-to-json';

export const getSchemaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as Config;

  const result = getSchemaService(reqData);

  res.json({ ...result });
};
