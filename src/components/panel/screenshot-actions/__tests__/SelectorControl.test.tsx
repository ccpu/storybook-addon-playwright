// import React from 'react';
import * as React from 'react';
import { SelectorControl } from '../SelectorControl';
import { mount } from 'enzyme';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { ActionProvider } from '../../../../store/actions/ActionContext';
import { SelectorManageSharedProps } from '../../../../hooks/use-selector-manager';
import { act } from 'react-dom/test-utils';
import * as reducer from '../../../../store/actions/reducer';
// import fetchMock from 'jest-fetch-mock';
// import * as actionContext from '../../../../store/actions/ActionContext';

// import { SelectorManageSharedProps } from '../../../../hooks/use-actions-data';

// const onMock = jest.fn();

// const useReducerSpy = jest.spyOn(React, 'useReducer');

// useReducerSpy.mockImplementation((init: any) => {
//   console.log(init);
//   return init;
// });

jest.mock('../../../../hooks/use-selector-manager', () => ({
  useSelectorManager() {
    return {
      startSelector: (props: SelectorManageSharedProps) => {
        props.onData({ path: 'div>div', x: 10, y: 10 });
      },
    };
  },
}));

jest.mock('../../../../hooks/use-actions-data', () => ({
  useActionData() {
    return { loading: false };
  },
}));

// jest.mock('../../../../hooks/use-storybook-addon-state', () => ({
//   useStoryBookAddonState() {
//     let state = {};
//     const setState = (s) => {
//       state = s;
//     };
//     return [state, setState];
//   },
// }));

describe('SelectorControl', () => {
  let spyOnDispatch: jest.SpyInstance<
    reducer.ReducerState,
    [reducer.ReducerState, reducer.Action]
  >;
  let onChangeMock: jest.Mock;
  let onAppendValueToTitleMock: jest.Mock;
  beforeEach(() => {
    onChangeMock = jest.fn();
    spyOnDispatch = jest.spyOn(reducer, 'reducer');
    onAppendValueToTitleMock = jest.fn();
  });

  afterEach(() => {
    onChangeMock.mockClear();
    spyOnDispatch.mockClear();
    onAppendValueToTitleMock.mockClear();
  });

  afterAll(() => {
    onChangeMock.mockRestore();
    spyOnDispatch.mockRestore();
    onAppendValueToTitleMock.mockRestore();
  });

  it('should mount numeric input', () => {
    const wrapper = mount(
      <ThemeProvider theme={convert(themes.light)}>
        <SelectorControl
          label="x"
          onChange={onChangeMock}
          type="number"
          selectorType="position"
          fullObjectPath="options.prop.x"
          actionId="actionId"
          isFollowedByPositionProp={false}
          appendValueToTitle={false}
          onAppendValueToTitle={onAppendValueToTitleMock}
          value={1}
        />
      </ThemeProvider>,
    );
    expect(wrapper.text()).toMatch('X');
    const input = wrapper.find('input');
    expect(input.props().value).toBe(1);
  });

  it('should mount textarea', () => {
    const wrapper = mount(
      <ThemeProvider theme={convert(themes.light)}>
        <SelectorControl
          label="selector"
          onChange={onChangeMock}
          type="text"
          selectorType="position"
          fullObjectPath="options.prop.x"
          actionId="actionId"
          isFollowedByPositionProp={false}
          appendValueToTitle={false}
          onAppendValueToTitle={onAppendValueToTitleMock}
          value={'value'}
        />
      </ThemeProvider>,
    );
    const input = wrapper.find('textarea');
    expect(input.props().value).toBe('value');
  });

  it('should validate selector', () => {
    const wrapper = mount(
      <ThemeProvider theme={convert(themes.light)}>
        <SelectorControl
          label="selector"
          onChange={onChangeMock}
          type="text"
          selectorType="position"
          fullObjectPath="options.prop.x"
          actionId="actionId"
          isFollowedByPositionProp={false}
          appendValueToTitle={false}
          onAppendValueToTitle={onAppendValueToTitleMock}
          value={'value'}
        />
      </ThemeProvider>,
    );
    const input = wrapper.find('textarea');
    input.simulate('change', { target: { value: 'div' } });
    expect(wrapper).toMatchSnapshot();
    expect(input.props().value).toBe('value');
  });

  it('should icon wrapper have class to be able to set height and margin, so it can hide bellow icon', () => {
    const wrapper = mount(
      <ThemeProvider theme={convert(themes.light)}>
        <SelectorControl
          label="x"
          onChange={onChangeMock}
          type="number"
          selectorType="position"
          fullObjectPath="options.prop.x"
          actionId="actionId"
          isFollowedByPositionProp={true}
          appendValueToTitle={false}
          onAppendValueToTitle={onAppendValueToTitleMock}
          value={1}
        />
      </ThemeProvider>,
    );

    expect(wrapper.find('.selector-root > div')).toHaveClassName(
      'SelectorControl-buttonWrap-2',
    );
  });

  it('should start selector and return selector path', () => {
    const wrapper = mount(
      <ActionProvider>
        <ThemeProvider theme={convert(themes.light)}>
          <SelectorControl
            label="selector"
            onChange={onChangeMock}
            type="text"
            selectorType="selector"
            fullObjectPath="options.prop.selector"
            actionId="actionId"
            isFollowedByPositionProp={false}
            appendValueToTitle={false}
            onAppendValueToTitle={onAppendValueToTitleMock}
            value={'value'}
          />
        </ThemeProvider>
      </ActionProvider>,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick({} as React.MouseEvent);
    });

    expect(spyOnDispatch.mock.calls[1][1]).toStrictEqual({
      actionId: 'actionId',
      objPath: 'options.prop.selector',
      type: 'setActionOptions',
      val: 'div>div',
    });
  });

  it('should set x position', () => {
    // const spyOnDispatch = jest.spyOn(reducer, 'reducer');

    const wrapper = mount(
      <ActionProvider>
        <ThemeProvider theme={convert(themes.light)}>
          <SelectorControl
            label="x"
            onChange={onChangeMock}
            type="number"
            selectorType="position"
            fullObjectPath="options.prop.x"
            actionId="actionId"
            isFollowedByPositionProp={false}
            appendValueToTitle={false}
            onAppendValueToTitle={onAppendValueToTitleMock}
            value={1}
          />
        </ThemeProvider>
      </ActionProvider>,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick({} as React.MouseEvent);
    });

    expect(onChangeMock).toHaveBeenCalledWith(10);
  });

  it('should set x y position when isFollowedByPositionProp', () => {
    const spyOnDispatch = jest.spyOn(reducer, 'reducer');

    const wrapper = mount(
      <ActionProvider>
        <ThemeProvider theme={convert(themes.light)}>
          <SelectorControl
            label="x"
            onChange={onChangeMock}
            type="number"
            selectorType="position"
            fullObjectPath="options.prop.x"
            actionId="actionId"
            isFollowedByPositionProp={true}
            appendValueToTitle={false}
            onAppendValueToTitle={onAppendValueToTitleMock}
            value={1}
          />
        </ThemeProvider>
      </ActionProvider>,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick({} as React.MouseEvent);
    });

    expect(spyOnDispatch.mock.calls[1][1]).toStrictEqual({
      actionId: 'actionId',
      objPath: 'options.prop.x',
      type: 'setActionOptions',
      val: 10,
    });

    expect(spyOnDispatch.mock.calls[2][1]).toStrictEqual({
      actionId: 'actionId',
      objPath: 'options.prop.y',
      type: 'setActionOptions',
      val: 10,
    });
  });
});
