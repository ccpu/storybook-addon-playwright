// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
// Also patches React.default.useEffect for components using React.useEffect().
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) => (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import { ImageDiffMessage } from '../../../src/components/common/ImageDiffMessage';
import '../../manual-mocks/react-useEffect';
import { shallow } from 'enzyme';
import React from 'react';
import { ImageDiffPreviewDialog } from '../../../src/components/common/ImageDiffPreviewDialog';
import { toast } from '../../../src/utils/toast';

describe('ImageDiffMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');
    vi.spyOn(toast, 'success').mockImplementation(() => 'toast-id');
  });

  it('should do nothing if result undefined', () => {
    const wrapper = shallow(<ImageDiffMessage result={undefined} onClose={vi.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
    expect(toast.success).toHaveBeenCalledTimes(0);
    expect(toast.error).toHaveBeenCalledTimes(0);
    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(0);
  });

  it('should show message for added screenshot', () => {
    const wrapper = shallow(
      <ImageDiffMessage result={{ added: true, pass: false }} onClose={vi.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(vi.mocked(toast.success).mock.calls[0][0]).toBe(
      'Screenshot  saved successfully.',
    );
  });

  it('should screenshot image diff successfully passed snackbar', () => {
    shallow(<ImageDiffMessage result={{ pass: true }} onClose={vi.fn()} />);

    expect(vi.mocked(toast.success).mock.calls[0][0]).toBe(
      'Testing existing screenshot were successful, no change has been detected.',
    );
  });

  it('should show error message if found image size difference', () => {
    shallow(
      <ImageDiffMessage
        result={{
          diffSize: true,
          imageDimensions: {
            baselineHeight: 20,
            baselineWidth: 20,
            receivedHeight: 10,
            receivedWidth: 10,
          },
          pass: false,
        }}
        onClose={vi.fn()}
      />,
    );

    expect(vi.mocked(toast.error).mock.calls[0][0]).toBe(
      'Expected image to be the same size as the snapshot (20x20), but was different (10x10).',
    );
  });

  it('should show/close ImageDiffPreviewDialog found difference', () => {
    const onCloseMock = vi.fn();
    const wrapper = shallow(
      <ImageDiffMessage
        result={{
          pass: false,
        }}
        onClose={onCloseMock}
      />,
    );

    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(1);
    wrapper.props().onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
