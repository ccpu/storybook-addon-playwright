import { BrowserIcon } from '../BrowserIcon';
import { BrowserIconButton } from '../BrowserIconButton';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';

describe('BrowserIcon', () => {
  const clickMock = jest.fn();
  beforeEach(() => {
    clickMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <BrowserIconButton
        active={false}
        browserType="chromium"
        onClick={clickMock}
      />,
    );
    expect(wrapper.find(BrowserIcon)).toHaveLength(1);
  });

  it('should handle click', () => {
    const wrapper = shallow(
      <BrowserIconButton
        active={false}
        browserType="chromium"
        onClick={clickMock}
      />,
    );
    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(clickMock).toHaveBeenCalledWith('chromium');
  });
});
