import React from 'react';
import { SnackbarContent } from '../SnackbarContent';
import { shallow } from 'enzyme';
import { AlertTitle } from '@material-ui/lab';
import Icon from '@material-ui/icons/AcUnit';
import { Button } from '@material-ui/core';

describe('SnackbarContent', () => {
  it('should render', () => {
    const wrapper = shallow(<SnackbarContent message="message" />);
    expect(wrapper.find('div').exists()).toBeTruthy();
  });

  it('should have title', () => {
    const wrapper = shallow(
      <SnackbarContent message="message" title={'title'} />,
    );
    expect(wrapper.find(AlertTitle).exists()).toBeTruthy();
  });

  it('should use children', () => {
    const wrapper = shallow(
      <SnackbarContent message="">
        <Icon />
      </SnackbarContent>,
    );
    expect(wrapper.find(Icon).exists()).toBeTruthy();
  });

  it('should have retry button', () => {
    const onRetryMock = jest.fn();
    const wrapper = shallow(
      <SnackbarContent
        message="message"
        title={'title'}
        onRetry={onRetryMock}
      />,
    );
    expect(wrapper.find(Button).exists()).toBeTruthy();
    wrapper
      .find(Button)
      .props()
      .onClick({} as never);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });
});
