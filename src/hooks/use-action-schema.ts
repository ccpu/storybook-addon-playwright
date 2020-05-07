import { useState, useEffect } from 'react';
import { getActionSchema } from '../api/client/get-action-schema';
import { ActionSchemaList } from '../typings';

export const useActionSchema = () => {
  const [actionSchema, setActionSchema] = useState<ActionSchemaList>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading || actionSchema) return;
    setLoading(true);
    getActionSchema()
      .then((act) => {
        setActionSchema(act);
      })
      .finally(() => setLoading(false));
  }, [actionSchema, loading]);

  return { actionSchema, loading };
};
