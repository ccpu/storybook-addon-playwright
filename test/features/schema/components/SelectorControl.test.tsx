import * as React from 'react';
import {
  SelectorControl,
  SelectorControlProps,
} from '../../../../src/features/schema/components/SelectorControl';
import { mount } from 'enzyme';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { SelectorManageSharedProps } from '../../../../src/hooks/use-selector-manager';
import { act } from 'react-dom/test-utils';

vi.mock('../../../../src/api/trpc/client', () => ({
  createTrpcHttpClient: () => ({}),
  trpcClient: {
    schema: {
      getClientConfig: {
        useQuery: () => ({
          data: {
            selectorAttributeNames: [],
          },
        }),
      },
    },
  },
}));

vi.mock('../../../../src/hooks/use-selector-manager', () => ({
  useSelectorManager() {
    return {
      startSelector: (props: SelectorManageSharedProps) => {
        props.onData?.({ path: 'div>div', x: 10, y: 10 });
      },
    };
  },
}));

describe('SelectorControl', () => {
  const onChangeMock = vi.fn();
  const onAppendValueToTitleMock = vi.fn();

  const onSelectorChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    onChangeMock.mockRestore();

    onAppendValueToTitleMock.mockRestore();
  });

  const Component = (props: Partial<SelectorControlProps>) => {
    return (
      <ThemeProvider theme={convert(themes.light)}>
        <SelectorControl
          label="selector"
          onChange={onChangeMock}
          type="text"
          selectorType="selector"
          fullObjectPath="options.prop.selector"
          isFollowedByPositionProp={false}
          appendValueToTitle={false}
          onAppendValueToTitle={onAppendValueToTitleMock}
          value="value"
          isRequired={false}
          onSelectorChange={onSelectorChangeMock}
          {...props}
        />
      </ThemeProvider>
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
    expect(wrapper.find('.selector-error').exists()).toBeTruthy();
  });

  it('should validate on blur', () => {
    const wrapper = mount(<Component />);
    const input = wrapper.find('textarea');
    input.simulate('blur');
    expect(wrapper.find('.selector-error').exists()).toBeTruthy();
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
    expect(wrapper.find('.selector-error').exists()).toBeFalsy();
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
        ?.startsWith('SelectorControl-buttonWrap'),
    ).toBe(true);
  });

  it('should set selector mode title for primary action button', () => {
    const wrapper = mount(<Component />);

    const button = wrapper.find('button').first();

    expect(button.prop('title')).toBe(
      'Select element on the page to get its selector path',
    );
  });

  it('should set id selector title for secondary action button', () => {
    const wrapper = mount(<Component />);

    const button = wrapper.find('button').at(1);

    expect(button.prop('title')).toBe(
      'Select element by ID or attributes set on selectorAttributeNames in config',
    );
  });

  it('should set position mode title for primary action button', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        value={1}
      />,
    );

    const button = wrapper.find('button').first();

    expect(button.prop('title')).toBe(
      'Select element on the page to get its position relative to the viewport',
    );
  });

  it('should hide primary action button for y position controls', () => {
    const wrapper = mount(
      <Component
        label="y"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.y"
        value={1}
      />,
    );

    const button = wrapper.find('button').first();

    expect(button.prop('style')).toMatchObject({ visibility: 'hidden' });
  });

  it('should offset primary action button for x position controls', () => {
    const wrapper = mount(
      <Component
        label="x"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.x"
        value={1}
      />,
    );

    const button = wrapper.find('button').first();

    expect(button.prop('style')).toMatchObject({
      bottom: -20,
      position: 'relative',
    });
  });

  it('should start selector and return selector path', () => {
    const wrapper = mount(<Component />);

    const button = wrapper.find('button');

    act(() => {
      button
        .first()
        .props()
        .onClick?.({} as React.MouseEvent);
    });

    expect(onSelectorChangeMock).toHaveBeenCalledWith('options.prop.selector', 'div>div');
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
      button.props().onClick?.({} as React.MouseEvent);
    });

    expect(onChangeMock).toHaveBeenCalledWith(10);
  });

  it('should set top position', () => {
    const wrapper = mount(
      <Component
        label="top"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.top"
        appendValueToTitle={false}
        value={1}
      />,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick?.({} as React.MouseEvent);
    });

    expect(onChangeMock).toHaveBeenCalledWith(10);
  });

  it('should set left position', () => {
    const wrapper = mount(
      <Component
        label="left"
        type="number"
        selectorType="position"
        fullObjectPath="options.prop.left"
        appendValueToTitle={false}
        value={1}
      />,
    );

    const button = wrapper.find('button');

    act(() => {
      button.props().onClick?.({} as React.MouseEvent);
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
      button.props().onClick?.({} as React.MouseEvent);
    });

    expect(onSelectorChangeMock).toHaveBeenCalledWith('options.prop.x', 10);
    expect(onSelectorChangeMock).toHaveBeenCalledWith('options.prop.y', 10);
  });
});
