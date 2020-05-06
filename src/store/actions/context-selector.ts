import { ActionContext } from './ActionContext';
import { useContextSelector } from 'use-context-selector';
import { ReducerState } from './reducer';

export const useActionContextSelector = <S>(
  selector: (value: ReducerState) => S,
) => useContextSelector(ActionContext, selector);
