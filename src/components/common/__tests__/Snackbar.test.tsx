import { Snackbar, getColor } from '../Snackbar';
import { shallow } from 'enzyme';
import React from 'react';
import { Snackbar as MUSnackbar } from '@material-ui/core';
import { Color } from '@material-ui/lab';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
}));

describe('Snackbar', () => {
  it('should render', () => {
    const wrapper = shallow(<Snackbar onClose={jest.fn()} />);
    expect(wrapper.find(MUSnackbar)).toHaveLength(1);
  });

  it('should handle close', () => {
    const closeMock = jest.fn();
    const wrapper = shallow(<Snackbar onClose={closeMock} />);
    wrapper
      .find(MUSnackbar)
      .props()
      .onClose({} as React.SyntheticEvent<unknown, Event>, 'clickaway');
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it('should have valid color base on types', () => {
    expect(getColor('error')).toBe('#FAB3AE');
    expect(getColor('error', true)).toBe('#DD3C31');

    expect(getColor('info')).toBe('#A6D5FA');
    expect(getColor('info', true)).toBe('#1D88DC');

    expect(getColor('warning')).toBe('rgb(255, 213, 153)');
    expect(getColor('warning', true)).toBe('#ff9800');

    expect(getColor('success')).toBe('rgb(183, 223, 185)');
    expect(getColor('success', true)).toBe('#4caf50');

    expect(getColor('invalid' as Color)).toBe('');
  });

  it('should append div to body to be used by portal', () => {
    shallow(<Snackbar onClose={jest.fn()} />);

    expect(document.body.querySelector('.snackbar-portal').nodeName).toBe(
      'DIV',
    );
  });
});
