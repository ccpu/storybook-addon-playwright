import { getStorybookState } from '../../configs/storybook-state';
import { ThemeProvider } from '../../../src/components/common/ThemeProvider';
import { shallow } from 'enzyme';
import React from 'react';
import { useStorybookState } from '@storybook/manager-api';
import { useCustomTheme } from '../../../src/features/theme/hooks/use-custom-theme';

vi.mock(
  '../../../src/features/theme/hooks/use-custom-theme',
  async () => await import('../../features/theme/hooks/__mocks__/use-custom-theme'),
);
const useCustomThemeMock = useCustomTheme as Mock;

describe('ThemeProvider', () => {
  it('should have light theme', () => {
    (useStorybookState as Mock).mockImplementationOnce(() => getStorybookState('light'));
    useCustomThemeMock.mockImplementationOnce(() => {
      return {
        theme: undefined,
      };
    });
    const wrapper = shallow(
      <ThemeProvider>
        <div>test</div>
      </ThemeProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should have dark theme', () => {
    (useStorybookState as Mock).mockImplementationOnce(() => getStorybookState('dark'));

    useCustomThemeMock.mockImplementationOnce(() => {
      return {
        theme: undefined,
      };
    });

    const wrapper = shallow(
      <ThemeProvider>
        <div>test</div>
      </ThemeProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should override theme using useCustomTheme', () => {
    (useStorybookState as Mock).mockImplementationOnce(() => getStorybookState('light'));

    useCustomThemeMock.mockImplementationOnce(() => {
      return {
        theme: {
          palette: {
            primary: {
              main: '#000000',
            },
          },
        },
      };
    });

    const wrapper = shallow(
      <ThemeProvider>
        <div>test</div>
      </ThemeProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
