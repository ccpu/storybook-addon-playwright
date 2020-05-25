import { SnackbarWithRetry } from '../SnackbarWithRetry';
import { shallow } from 'enzyme';
import React from 'react';
import { Button } from '@material-ui/core';
import { Snackbar } from '../Snackbar';

describe('SnackbarWithRetry', () => {
  it('should render', () => {
    const retryMock = jest.fn();
    const closeMock = jest.fn();

    const wrapper = shallow(
      <SnackbarWithRetry
        onClose={closeMock}
        open={true}
        message="foo"
        onRetry={retryMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    wrapper
      .find(Button)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    expect(retryMock).toHaveBeenCalledTimes(1);

    expect(wrapper.find(Snackbar).text()).toBe('fooRetry');
  });

  it('should render child', () => {
    const wrapper = shallow(
      <SnackbarWithRetry
        onClose={jest.fn()}
        open={true}
        message="foo"
        onRetry={jest.fn()}
      >
        <span>bar</span>
      </SnackbarWithRetry>,
    );

    expect(wrapper.find('span').text()).toBe('bar');
  });
});
