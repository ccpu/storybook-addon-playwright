import {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import addons from '@storybook/addons';
import { Channel } from '@storybook/channels';

export const makeGlobalStateId = (id: string) => {
  return `__playwright_${id}`;
};

const getData = (id: string, persistence: boolean) => {
  if (persistence) {
    const data = window.localStorage.getItem(makeGlobalStateId(id));
    if (!data) return;
    const parsedData = JSON.parse(data);
    return parsedData.value;
  } else {
    return window[makeGlobalStateId(id)];
  }
};

const setData = <T>(state: T, id: string, persistence: boolean) => {
  if (persistence) {
    window.localStorage.setItem(
      makeGlobalStateId(id),
      JSON.stringify({ value: state }),
    );
  } else {
    window[makeGlobalStateId(id)] = state;
  }
};

export const useGlobalState = <T>(
  id: string,
  persistence?: boolean,
): [T, Dispatch<SetStateAction<T>>] => {
  const [globalState, setState] = useState<T>({} as never);

  const chanel = useRef<Channel>(addons.getChannel());

  const setGlobalState = useCallback(
    (state: T) => {
      setData(state, id, persistence);
      chanel.current.emit(makeGlobalStateId(id));
    },
    [id, persistence],
  );

  useEffect(() => {
    const storedData = getData(id, persistence);
    setState(storedData ? storedData : {});
    chanel.current.on(makeGlobalStateId(id), () => {
      setState(getData(id, persistence));
    });
  }, [id, persistence]);

  return [globalState, setGlobalState as Dispatch<SetStateAction<T>>];
};
