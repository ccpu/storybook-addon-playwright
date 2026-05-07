import { useStorybookState } from '@storybook/manager-api';
import { useEffect, useState } from 'react';
import { constructStoryUrl } from '../utils';

export function useStoryUrl() {
  const state = useStorybookState();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let newUrl = constructStoryUrl(window.location.host, state.storyId);

    const queryKeys = Object.keys(state.customQueryParams);
    if (queryKeys.length > 0) {
      const query = queryKeys.map((key) => {
        const val = state.customQueryParams[key];

        return `${key}=${val}`;
      });
      newUrl += `&${query.join('&')}`;
    }

    setUrl(newUrl);
  }, [state.customQueryParams, state.storyId]);

  return url;
}
