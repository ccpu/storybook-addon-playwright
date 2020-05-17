import { dispatchMock } from '../../../../__test_helper__/manual-mocks/store/action/context';
import * as React from 'react';
import { SelectorControl, SelectorControlProps } from '../SelectorControl';
import { mount } from 'enzyme';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { SelectorManageSharedProps } from '../../../hooks/use-selector-manager';
import { act } from 'react-dom/test-utils';

jest.mock('../../../hooks/use-selector-manager', () => ({
  useSelectorManager() {
    return {
      startSelector: (props: SelectorManageSharedProps) => {
        props.onData({ path: 'div>div', x: 10, y: 10 });
      },
    };
  },
}));

describe('SelectorControl', () => {
  const onChangeMock = jest.fn();
  const onAppendValueToTitleMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
    dispatchMock.mockClear();
    onAppendValueToTitleMock.mockClear();
  });

  afterAll(() => {
    onChangeMock.mockRestore();
    dispatchMock.mockRestore();
    onAppendValueToTitleMock.mockRestore();
  });

  const Component = (props: Partial<SelectorControlProps>) => {
    return (
      // <ActionProvider>
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
          isRequired={false}
          {...props}
        />
      </ThemeProvider>
      // </ActionProvider>
    );
  };

  it('should mount numeric input', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        value={1}
      />,
    );
    expect(wrapper.text()).toMatch('X');
    const input = wrapper.find('input');
    expect(input.props().value).toBe(1);
  });

  it('should mount textarea', () => {
    const wrapper = mount(<Component />);
    const input = wrapper.find('textarea');
    expect(input.props().value).toBe('value');
  });

  it('should validate selector', () => {
    const wrapper = mount(<Component />);
    const input = wrapper.find('textarea');
    input.simulate('change', { target: { value: 'div' } });
    expect(wrapper.find('.selector-error')).toExist();
  });

  it('should validate on blur', () => {
    const wrapper = mount(<Component />);
    const input = wrapper.find('textarea');
    input.simulate('blur');
    expect(wrapper.find('.selector-error')).toExist();
  });

  it('should not validate positions', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        value={1}
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 10 } });
    expect(wrapper.find('.selector-error')).not.toExist();
  });

  it('should handle incoming value', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        isFollowedByPositionProp={true}
        value={1}
      />,
    );
    wrapper.setProps({ value: 20 });

    wrapper.update();

    const input = wrapper.find('input');
    expect(input.props().value).toBe(20);
  });

  it('should icon wrapper have class to be able to set height and margin, so it can hide bellow icon', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        isFollowedByPositionProp={true}
        value={1}
      />,
    );

    expect(
      wrapper
        .find('.selector-root > div')
        .prop('className')
        .startsWith('SelectorControl-buttonWrap'),
    ).toBe(true);
  });

  it('should start selector and return selector path', () => {
    const wrapper = mount(<Component />);

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick({} as React.MouseEvent);
    });

    const data = dispatchMock.mock.calls[0][0][0];

    expect(data).toStrictEqual({
      actionId: 'actionId',
      objPath: 'options.prop.selector',
      type: 'setActionOptions',
      val: 'div>div',
    });
  });

  it('should set x position', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        appendValueToTitle={false}
        value={1}
      />,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick({} as React.MouseEvent);
    });

    expect(onChangeMock).toHaveBeenCalledWith(10);
  });

  it('should set x y position when isFollowedByPositionProp', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        isFollowedByPositionProp={true}
        value={1}
      />,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick({} as React.MouseEvent);
    });

    const data = dispatchMock.mock.calls;

    expect(data[0][0][0]).toStrictEqual({
      actionId: 'actionId',
      objPath: 'options.prop.x',
      type: 'setActionOptions',
      val: 10,
    });

    expect(data[1][0][0]).toStrictEqual({
      actionId: 'actionId',
      objPath: 'options.prop.y',
      type: 'setActionOptions',
      val: 10,
    });
  });
});
