import {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import addons from '@storybook/addons';
import useMount from 'react-use/lib/useMount';

export const makeGlobalStateId = (id: string) => {
  return `__playwright_${id}`;
};

const getData = (id: string, persistence: boolean, defaultState?: unknown) => {
  if (persistence) {
    const localStorage = window.localStorage.getItem(makeGlobalStateId(id));
    if (!localStorage) return defaultState;
    const data = JSON.parse(localStorage);
    return data.value;
  } else {
    const windowData = window[makeGlobalStateId(id)];
    if (!windowData) return defaultState;
    return windowData.value;
  }
};

const setData = <T>(state: T, id: string, persistence: boolean) => {
  const data = state === undefined ? {} : { value: state };
  if (persistence) {
    window.localStorage.setItem(makeGlobalStateId(id), JSON.stringify(data));
  } else {
    window[makeGlobalStateId(id)] = data;
  }
};

export const useGlobalState = <T>(
  id: string,
  persistence?: boolean,
  defaultState?: unknown,
): [T, Dispatch<SetStateAction<T>>] => {
  const [globalState, setState] = useState<T>({} as never);

  const setGlobalState = useCallback(
    (state: T) => {
      const chanel = addons.getChannel();
      setData(state, id, persistence);
      chanel.emit(makeGlobalStateId(id));
    },
    [id, persistence],
  );

  useMount(() => {
    const storedData = getData(id, persistence, defaultState);
    setState(storedData);
  });

  useEffect(() => {
    const chanel = addons.getChannel();

    const handleUpdateState = () => {
      setState(getData(id, persistence));
    };

    chanel.on(makeGlobalStateId(id), handleUpdateState);

    return () => {
      chanel.off(makeGlobalStateId(id), handleUpdateState);
    };
  }, [id, persistence]);

  return [globalState, setGlobalState as Dispatch<SetStateAction<T>>];
};
