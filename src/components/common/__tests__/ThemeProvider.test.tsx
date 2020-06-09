import { getStorybookState } from '../../../../__test_data__/storybook-state';
import { ThemeProvider } from '../ThemeProvider';
import { shallow } from 'enzyme';
import React from 'react';
import { useStorybookState } from '@storybook/api';

describe('ThemeProvider', () => {
  it('should have light theme', () => {
    (useStorybookState as jest.Mock).mockImplementationOnce(() =>
      getStorybookState('light'),
    );
    const wrapper = shallow(
      <ThemeProvider>
        <div>test</div>
      </ThemeProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should have dark theme', () => {
    (useStorybookState as jest.Mock).mockImplementationOnce(() =>
      getStorybookState('dark'),
    );

    const wrapper = shallow(
      <ThemeProvider>
        <div>test</div>
      </ThemeProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
