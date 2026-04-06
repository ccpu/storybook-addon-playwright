import { ScreenshotInfo } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotInfo';
import { shallow } from 'enzyme';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';
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
          actionSets: [
            {
              actions: [
                {
                  id: 'action-id',
                  name: 'action-name',
                },
              ],
              id: 'action-set-id',
              title: 'action-set-title',
            },
          ],
          props: { prop: 'prop-val' },
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
      actionSets: [
        {
          actions: [{ id: 'action-id', name: 'action-name' }],
          id: 'action-set-id',
          title: 'action-set-title',
        },
      ],
      browserType: 'chromium',
      props: { prop: 'prop-val' },
      title: 'title',
    });
  });

  it('should call onClose', () => {
    const onCloseMock = vi.fn();

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
