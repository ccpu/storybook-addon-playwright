import { dispatchMock } from '../../../__manual_mocks__/store/action/context';
import { useCopyActionSet } from '../use-copy-action-set';
import { useAsyncApiCall } from '../use-async-api-call';
import { renderHook } from '@testing-library/react-hooks';
import { StoryData } from '../../typings';

vi.mock('../use-async-api-call');

const onSaveMock = vi.fn();
vi.mocked(useAsyncApiCall).mockImplementation(() => ({
  ErrorSnackbar: vi.fn(),
  clearError: vi.fn(),
  clearResult: vi.fn(),
  error: undefined,
  inProgress: false,
  makeCall: onSaveMock,
  result: undefined,
}));

describe('useCopyActionSet', () => {
  it('should copy', async () => {
    const { result } = renderHook(() =>
      useCopyActionSet({
        id: 'story-id',
        parameters: { fileName: 'file-name', options: {} },
      } as StoryData),
    );

    await result.current.copyActionSet({
      actions: [],
      id: 'action-set-id',
      title: 'action-set-title',
    });

    expect(onSaveMock).toHaveBeenCalledWith({
      actionSet: { actions: [], id: 'id-1', title: 'action-set-title' },
      fileName: 'file-name',
      storyId: 'story-id',
    });
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSet: { actions: [], id: 'id-1', title: 'action-set-title' },
        new: false,
        selected: true,
        storyId: 'story-id',
        type: 'addActionSet',
      },
    ]);
  });
});
