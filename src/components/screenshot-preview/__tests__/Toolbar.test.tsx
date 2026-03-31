import { Toolbar } from '../Toolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { useBrowserOptions } from '../../../hooks/use-browser-options';

vi.mock('../../../hooks//use-browser-options.ts');

const setBrowserOptionsMock = vi.fn();
(useBrowserOptions as Mock).mockImplementation(() => {
  return {
    browserOptions: {},
    setBrowserOptions: setBrowserOptionsMock,
  };
});

describe('Toolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={vi.fn()}
        onRefresh={vi.fn()}
        toggleBrowser={vi.fn()}
        onSave={vi.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle show cursor', () => {
    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={vi.fn()}
        onRefresh={vi.fn()}
        toggleBrowser={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    wrapper
      .find('.cursor-button')
      .props()
      .onClick({} as React.MouseEvent<unknown, MouseEvent>);

    expect(setBrowserOptionsMock).toHaveBeenCalledWith('all', { cursor: true });
  });

  it('should handle disable cursor', () => {
    (useBrowserOptions as Mock).mockImplementationOnce(() => ({
      browserOptions: { all: { cursor: true } },
      setBrowserOptions: setBrowserOptionsMock,
    }));

    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={vi.fn()}
        onRefresh={vi.fn()}
        toggleBrowser={vi.fn()}
        onSave={vi.fn()}
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
