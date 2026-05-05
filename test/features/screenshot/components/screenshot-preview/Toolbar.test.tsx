import { Toolbar } from '../../../../../src/features/screenshot/components/screenshot-preview/Toolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { useBrowserOptions } from '../../../../../src/hooks/use-browser-options';

vi.mock(
  '../../../../../src/hooks/use-browser-options',
  async () => await import('../../../../hooks/__mocks__/use-browser-options'),
);

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
      .onClick?.({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

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
      .onClick?.({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(setBrowserOptionsMock).toHaveBeenCalledWith('all', {
      cursor: undefined,
    });
  });
});
