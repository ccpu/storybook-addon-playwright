import { useRef } from 'react';
export const useThrottleFn = jest.fn();
useThrottleFn.mockImplementation((cb, _delay, data) => {
  const mounted = useRef<boolean>(false);
  if (!mounted.current) {
    mounted.current = true;
    return;
  }
  cb(...data);
});

export default useThrottleFn;
