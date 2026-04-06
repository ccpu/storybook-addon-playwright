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
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotDelete } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotDelete';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';
import { useDeleteScreenshot } from '../../../../../src/features/screenshot/hooks/use-delete-screenshot';
import { DeleteConfirmationButton } from '../../../../../src/components/common';

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-delete-screenshot',
  async () => await import('../../hooks/__mocks__/use-delete-screenshot'),
);
const useDeleteScreenshotMock = useDeleteScreenshot as Mock;
const onDeleteMock = vi.fn();

describe('ScreenshotDelete', () => {
  it('should render', () => {
    const stateMock = vi.fn();
    const wrapper = shallow(
      <ScreenshotDelete
        screenshot={getScreenshotDate()}
        onClose={vi.fn()}
        onStateChange={stateMock}
        onDelete={onDeleteMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(stateMock).toHaveBeenCalledWith(false);
  });

  it('should delete', () => {
    const deleteMock = vi.fn();
    useDeleteScreenshotMock.mockImplementationOnce(() => {
      return {
        ErrorSnackbar: () => undefined,
        deleteScreenshot: deleteMock,
      };
    });

    const wrapper = shallow(
      <ScreenshotDelete
        screenshot={getScreenshotDate()}
        onClose={vi.fn()}
        onStateChange={vi.fn()}
        onDelete={onDeleteMock}
      />,
    );

    const dialog = wrapper.find(DeleteConfirmationButton);
    dialog.props().onDelete();
    expect(dialog).toBeDefined();
    expect(deleteMock).toHaveBeenCalledWith('screenshot-id');
    expect(onDeleteMock).toHaveBeenCalled();
  });
});
