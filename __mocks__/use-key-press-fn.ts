import { useKeyPressFn as orgUseKeyPressFn } from '../src/hooks/use-key-press-fn';

export const useKeyPressFn = vi.fn<typeof orgUseKeyPressFn>();
