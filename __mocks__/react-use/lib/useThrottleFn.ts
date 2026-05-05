import { useRef } from 'react';
import type useThrottleFnFn from 'react-use/lib/useThrottleFn';

export const useThrottleFn = vi.fn<typeof useThrottleFnFn>();
useThrottleFn.mockImplementation((cb, _delay, data) => {
  const mounted = useRef<boolean>(false);
  if (!mounted.current) {
    mounted.current = true;
    return;
  }
  cb(...data);
});

export default useThrottleFn;
