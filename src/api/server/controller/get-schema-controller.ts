import { getSchemaService, SchemaName } from '../services/get-schema-service';
import { Request, Response } from 'express';

export const getSchemaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body.type as SchemaName;

  const result = getSchemaService(reqData);

  res.json({ ...result });
};
