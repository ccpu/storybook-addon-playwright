import { Toolbar } from '../Toolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { useBrowserOptions } from '../../../hooks/use-browser-options';

jest.mock('../../../hooks//use-browser-options.ts');

const setBrowserOptionsMock = jest.fn();
(useBrowserOptions as jest.Mock).mockImplementation(() => {
  return {
    browserOptions: {},
    setBrowserOptions: setBrowserOptionsMock,
  };
});

describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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

    expect(setBrowserOptionsMock).toHaveBeenCalledWith('all', { cursor: true });
  });

  it('should handle disable cursor', () => {
    (useBrowserOptions as jest.Mock).mockImplementationOnce(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions: setBrowserOptionsMock,
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

    expect(setBrowserOptionsMock).toHaveBeenCalledWith('all', {
      cursor: undefined,
    });
  });
});
