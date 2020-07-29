/* eslint-disable @typescript-eslint/no-explicit-any */
import { useControl } from '../use-control';
import { renderHook, act } from '@testing-library/react-hooks';
import { ControlProps } from '../../typings';

describe('useControl', () => {
  const onAppendValueToTitleMock = jest.fn();
  const onChangeMock = jest.fn();
  const getControlOptions = (): ControlProps => {
    return {
      appendValueToTitle: false,
      isRequired: false,
      label: 'control-label',
      onAppendValueToTitle: onAppendValueToTitleMock,
      onChange: onChangeMock,
      type: 'text',
    };
  };

  afterEach(() => {
    onAppendValueToTitleMock.mockClear();
    onChangeMock.mockClear();
  });

  it('should return text control', () => {
    const {
      result: {
        current: { Control, knob },
      },
    } = renderHook(() => useControl(getControlOptions()));
    expect(Control).toBeDefined();
    expect(knob.value).toBe('');
  });

  it('should return number control', () => {
    const {
      result: {
        current: { Control, knob },
      },
    } = renderHook(() =>
      useControl({ ...getControlOptions(), type: 'number' }),
    );
    expect(Control).toBeDefined();
    expect(knob.value).toBe('');
  });

  it('should return boolean control', () => {
    const {
      result: {
        current: { Control, knob },
      },
    } = renderHook(() =>
      useControl({ ...getControlOptions(), type: 'boolean' }),
    );
    expect(Control).toBeDefined();
    expect(knob.value).toBe(false);
  });

  it('should  have default value', () => {
    const {
      result: {
        current: { Control, knob },
      },
    } = renderHook(() => useControl({ ...getControlOptions(), value: 'text' }));
    expect(Control).toBeDefined();
    expect(knob.value).toBe('text');
  });

  it('should return options control', () => {
    const {
      result: {
        current: { Control, knob },
      },
    } = renderHook(() =>
      useControl({
        ...getControlOptions(),
        options: ['1', '2'],
        type: 'options',
      }),
    );
    expect(Control).toBeDefined();
    expect((knob as any).options).toStrictEqual({ '1': '1', '2': '2' });
  });

  it('should return select control', () => {
    const {
      result: {
        current: { Control, knob },
      },
    } = renderHook(() =>
      useControl({
        ...getControlOptions(),
        options: ['1', '2'],
        type: 'select',
      }),
    );
    expect(Control).toBeDefined();
    expect((knob as any).options).toStrictEqual(['1', '2']);
  });

  it('should handle change', async () => {
    const {
      result: {
        current: { handleChange },
      },
    } = renderHook(() =>
      useControl({
        ...getControlOptions(),
        type: 'text',
        value: 'text-val',
      }),
    );

    act(() => {
      handleChange('new-val');
    });

    expect(onChangeMock).toHaveBeenCalledWith('new-val');
  });
});
