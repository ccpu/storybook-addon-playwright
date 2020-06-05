import { ScreenshotInfo } from '../ScreenshotInfo';
import { shallow } from 'enzyme';
import { getScreenshotDate } from './data';
import React from 'react';
import { IconButton, Popover } from '@material-ui/core';
import ReactJson from 'react-json-view';

describe('ScreenshotInfo', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotInfo screenshotData={getScreenshotDate()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show info', () => {
    const wrapper = shallow(
      <ScreenshotInfo screenshotData={getScreenshotDate()} />,
    );

    const button = wrapper.find(IconButton);

    expect(button.exists()).toBeTruthy();

    button
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >);

    const reactJsonComp = wrapper.find(ReactJson);

    expect(reactJsonComp).toHaveLength(1);

    expect(reactJsonComp.props().src).toStrictEqual({
      browserType: 'chromium',
      title: 'title',
    });
  });

  it('should show info with props and actions', () => {
    const wrapper = shallow(
      <ScreenshotInfo
        screenshotData={getScreenshotDate({
          actions: [{ id: 'id', name: 'action-name' }],
          props: [{ name: 'prop', value: 'prop-val' }],
        })}
      />,
    );

    const button = wrapper.find(IconButton);

    expect(button.exists()).toBeTruthy();

    button
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >);

    const reactJsonComp = wrapper.find(ReactJson);

    expect(reactJsonComp).toHaveLength(1);

    expect(reactJsonComp.props().src).toStrictEqual({
      actions: { 'action-name': undefined },
      browserType: 'chromium',
      props: { prop: 'prop-val' },
      title: 'title',
    });
  });

  it('should call onClose', () => {
    const onCloseMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotInfo
        onClose={onCloseMock}
        screenshotData={getScreenshotDate()}
      />,
    );

    const button = wrapper.find(IconButton);

    expect(button.exists()).toBeTruthy();

    button
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >);

    wrapper.find(Popover).props().onClose({}, 'backdropClick');

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
