import { Toolbar } from '../Toolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotOptions } from '../../../hooks/use-screenshot-options';

jest.mock('../../../hooks//use-screenshot-options.ts');

const setScreenshotOptionsMock = jest.fn();
(useScreenshotOptions as jest.Mock).mockImplementation(() => {
  return {
    screenshotOptions: undefined,
    setScreenshotOptions: setScreenshotOptionsMock,
  };
});

describe('Toolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={jest.fn()}
        onRefresh={jest.fn()}
        toggleBrowser={jest.fn()}
        onSave={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle show cursor', () => {
    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={jest.fn()}
        onRefresh={jest.fn()}
        toggleBrowser={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    wrapper
      .find('.cursor-button')
      .props()
      .onClick({} as React.MouseEvent<unknown, MouseEvent>);

    expect(setScreenshotOptionsMock).toHaveBeenCalledWith({ cursor: true });
  });

  it('should handle hide cursor', () => {
    (useScreenshotOptions as jest.Mock).mockImplementationOnce(() => ({
      screenshotOptions: { cursor: true },
      setScreenshotOptions: setScreenshotOptionsMock,
    }));

    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={jest.fn()}
        onRefresh={jest.fn()}
        toggleBrowser={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    wrapper
      .find('.cursor-button')
      .props()
      .onClick({} as React.MouseEvent<unknown, MouseEvent>);

    expect(setScreenshotOptionsMock).toHaveBeenCalledWith({
      cursor: undefined,
    });
  });
});
