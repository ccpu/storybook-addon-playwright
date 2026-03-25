/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// Mock Storybook theming for testing
export const themes = {
  dark: {
    appBg: '#2f2f2f',
    appBorderColor: 'rgba(255,255,255,.1)',
    appBorderRadius: 4,
    appContentBg: '#333',
    barBg: '#333333',
    barSelectedColor: '#1EA7FD',
    barTextColor: '#999999',
    base: 'dark',
    colorPrimary: '#FF4785',
    colorSecondary: '#1EA7FD',
    fontBase: '"Nunito Sans", sans-serif',
    fontCode: 'monospace',
    inputBg: '#3f3f3f',
    inputBorder: 'rgba(255,255,255,.1)',
    inputBorderRadius: 4,
    inputTextColor: '#FFFFFF',
    textColor: '#FFFFFF',
    textInverseColor: '#333333',
  },
  light: {
    appBg: '#F6F9FC',
    appBorderColor: 'rgba(0,0,0,.1)',
    appBorderRadius: 4,
    appContentBg: '#FFFFFF',
    barBg: '#FFFFFF',
    barSelectedColor: '#1EA7FD',
    barTextColor: '#999999',
    base: 'light',
    colorPrimary: '#FF4785',
    colorSecondary: '#1EA7FD',
    fontBase: '"Nunito Sans", sans-serif',
    fontCode: 'monospace',
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(0,0,0,.1)',
    inputBorderRadius: 4,
    inputTextColor: '#333333',
    textColor: '#333333',
    textInverseColor: '#FFFFFF',
  },
  normal: {
    appBg: '#F6F9FC',
    appBorderColor: 'rgba(0,0,0,.1)',
    appBorderRadius: 4,
    appContentBg: '#FFFFFF',
    barBg: '#FFFFFF',
    barSelectedColor: '#1EA7FD',
    barTextColor: '#999999',
    base: 'light',
    colorPrimary: '#FF4785',
    colorSecondary: '#1EA7FD',
    fontBase: '"Nunito Sans", sans-serif',
    fontCode: 'monospace',
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(0,0,0,.1)',
    inputBorderRadius: 4,
    inputTextColor: '#333333',
    textColor: '#333333',
    textInverseColor: '#FFFFFF',
  },
};

export const convert = (theme: any) => theme || themes.normal;

export const ThemeProvider = (props: any) =>
  React.createElement('div', null, props.children);

export const styled = new Proxy(
  (tag: any) => {
    return React.forwardRef((props: any, ref: any) =>
      React.createElement(tag, { ...props, ref }, props.children),
    );
  },
  {
    get: (_target, prop) => {
      return React.forwardRef((props: any, ref: any) =>
        React.createElement(String(prop), { ...props, ref }, props.children),
      );
    },
  },
);

export const css = () => '';
export const Global = () => null;
export const createGlobal = () => '';
export const keyframes = () => '';
export const useTheme = () => themes.normal;
export const withTheme = (Component: any) => Component;
export const ensure = (theme: any) => theme || themes.normal;
export const create = (vars: any) => ({ ...themes.normal, ...vars });

export default { ThemeProvider, convert, create, css, ensure, styled, themes };
