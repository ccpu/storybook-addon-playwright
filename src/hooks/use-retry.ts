import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';

export const useRetry = () => {
  const [currentRetryId, setRetryId] = useState<string>();
  const [previousRetryId, setPreviousRetryId] = useState<string>();

  const [retry, setRetry] = useState(false);

  useEffect(() => {
    setRetry(previousRetryId !== currentRetryId);
  }, [currentRetryId, previousRetryId]);

  const doRetry = useCallback(() => {
    setRetryId(nanoid());
  }, []);

  const retryEnd = useCallback(() => {
    setPreviousRetryId(currentRetryId);
  }, [currentRetryId]);

  return { doRetry, retry, retryEnd };
};
