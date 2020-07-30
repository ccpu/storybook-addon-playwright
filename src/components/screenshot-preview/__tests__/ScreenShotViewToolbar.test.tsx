import { ScreenShotViewToolbar } from '../ScreenShotViewToolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { CircularProgress } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/SaveAltOutlined';

describe('ScreenShotViewToolbar', () => {
  const onRefreshMock = jest.fn();
  const onSaveMock = jest.fn();
  beforeEach(() => {
    onRefreshMock.mockClear();
    onSaveMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenShotViewToolbar
        browserType="chromium"
        loading={false}
        onRefresh={onRefreshMock}
        onSave={onSaveMock}
        showSaveButton={false}
        onFullScreen={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show loading', () => {
    const wrapper = shallow(
      <ScreenShotViewToolbar
        browserType="chromium"
        loading={true}
        onRefresh={onRefreshMock}
        onSave={onSaveMock}
        showSaveButton={false}
        onFullScreen={jest.fn()}
      />,
    );
    expect(wrapper.find(CircularProgress).exists()).toBeTruthy();
  });

  it('should show save button', () => {
    const wrapper = shallow(
      <ScreenShotViewToolbar
        browserType="chromium"
        loading={true}
        onRefresh={onRefreshMock}
        onSave={onSaveMock}
        showSaveButton={false}
        onFullScreen={jest.fn()}
      />,
    );
    expect(wrapper.find(SaveIcon).exists()).toBeFalsy();
    wrapper.setProps({ showSaveButton: true });
    expect(wrapper.find(SaveIcon).exists()).toBeTruthy();
  });
});
