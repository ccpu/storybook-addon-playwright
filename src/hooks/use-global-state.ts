import { useEffect, useState, useCallback } from 'react';

const globalStorageId = 'playwright_';

const getData = (id: string, persistence: boolean) => {
  if (persistence) {
    const data = window.localStorage.getItem(globalStorageId + id);
    if (!data) return;
    return JSON.parse(data);
  } else {
    return window['__' + globalStorageId + id];
  }
};

const setData = <T>(state: T, id: string, persistence: boolean) => {
  if (persistence) {
    window.localStorage.setItem(globalStorageId + id, JSON.stringify(state));
  } else {
    window['__' + globalStorageId + id] = state;
  }
};

export const useGlobalState = <T>(id: string, persistence: boolean) => {
  const [globalState, setState] = useState<T>();

  const setGlobalState = useCallback(
    (state: T) => {
      setData(state, id, persistence);
      setState(state);
    },
    [id, persistence],
  );

  useEffect(() => {
    const data = getData(id, persistence);
    setState(data);
  }, [id, persistence]);

  return { globalState, setGlobalState };
};
