import { addActionSetMock } from '../../../manual-mocks/store/action/context';
import { useCopyActionSet } from '../../../../src/features/action-set/hooks/use-copy-action-set';
import { useAsyncApiCall } from '../../../../src/hooks/use-async-api-call';
import { renderHook } from '@testing-library/react-hooks';
import { StoryData } from '../../../../src/typings';

vi.mock(
  '../../../../src/hooks/use-async-api-call',
  async () => await import('../../../hooks/__mocks__/use-async-api-call'),
);

const onSaveMock = vi.fn();
vi.mocked(useAsyncApiCall).mockImplementation(() => ({
  ErrorSnackbar: () => null,
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
        filePath: './test.stories.tsx',
        id: 'story-id',
        parameters: { fileName: 'file-name', options: {} },
      } as unknown as StoryData),
    );

    await result.current.copyActionSet({
      actions: [],
      id: 'action-set-id',
      title: 'action-set-title',
    });

    expect(onSaveMock).toHaveBeenCalledWith({
      actionSet: { actions: [], id: 'id-1', title: 'action-set-title' },
      filePath: './test.stories.tsx',
      storyId: 'story-id',
    });
    expect(addActionSetMock).toHaveBeenCalledWith({
      actionSet: { actions: [], id: 'id-1', title: 'action-set-title' },
      isNew: false,
      selected: true,
      storyId: 'story-id',
    });
  });
});
