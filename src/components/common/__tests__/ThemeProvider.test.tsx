import { getStorybookState } from '../../../../__test_data__/storybook-state';
import { ThemeProvider } from '../ThemeProvider';
import { shallow } from 'enzyme';
import React from 'react';
import { useStorybookState } from '@storybook/manager-api';
import { useCustomTheme } from '../../../features/theme/hooks/use-custom-theme';

vi.mock('../../../features/theme/hooks/use-custom-theme.ts');
const useCustomThemeMock = useCustomTheme as Mock;

describe('ThemeProvider', () => {
  it('should have light theme', () => {
    (useStorybookState as Mock).mockImplementationOnce(() =>
      getStorybookState('light'),
    );
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
    (useStorybookState as Mock).mockImplementationOnce(() =>
      getStorybookState('dark'),
    );

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
    (useStorybookState as Mock).mockImplementationOnce(() =>
      getStorybookState('light'),
    );

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
