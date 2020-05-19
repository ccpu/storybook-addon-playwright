import { BrowserIconButton, BrowserIcon } from '../BrowserIcon';
import { shallow } from 'enzyme';
import React from 'react';
import { Chrome, Firefox, Webkit, Browser } from '../../../icons';
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

  it('should render Browser icon', () => {
    const wrapper = shallow(<BrowserIcon />);
    expect(wrapper.find(Browser)).toHaveLength(1);
  });

  it('should render chromium icon', () => {
    const wrapper = shallow(<BrowserIcon browserType="chromium" />);
    expect(wrapper.find(Chrome)).toHaveLength(1);
  });

  it('should render firefox icon', () => {
    const wrapper = shallow(<BrowserIcon browserType="firefox" />);
    expect(wrapper.find(Firefox).exists()).toBeTruthy();
  });

  it('should render webkit icon', () => {
    const wrapper = shallow(<BrowserIcon browserType="webkit" />);
    expect(wrapper.find(Webkit).exists()).toBeTruthy();
  });
});
