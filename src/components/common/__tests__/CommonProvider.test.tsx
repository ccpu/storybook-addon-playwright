// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import { useEffectCleanup } from '../../../../__manual_mocks__/react-useEffect';
import { CommonProvider } from '../CommonProvider';
import { shallow } from 'enzyme';
import React from 'react';

describe('CommonProvider', () => {
  it('should render', () => {
    const wrapper = shallow(
      <CommonProvider>
        <div>test</div>
      </CommonProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should remove root element when unmounted', () => {
    const spy = vi.spyOn(document.body, 'removeChild');
    shallow(
      <CommonProvider>
        <div>test</div>
      </CommonProvider>,
    );
    useEffectCleanup();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
