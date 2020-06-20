import { ScreenshotOptions } from '../ScreenshotOptions';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Typography, FormControlLabel, Button } from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';

describe('ScreenshotOptions', () => {
  const errorMessage = 'Please current items highlighted in red.';

  it('should render', () => {
    const wrapper = shallow(<ScreenshotOptions onChange={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have defaults', () => {
    const wrapper = shallow(
      <ScreenshotOptions
        onChange={jest.fn()}
        options={{
          clip: { height: 1, width: 2, x: 3, y: 4 },
          fullPage: true,
          omitBackground: true,
          quality: 1,
          type: 'jpeg',
        }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  const clipInputs = (
    wrapper: ShallowWrapper<
      unknown,
      Readonly<unknown>,
      React.Component<unknown, unknown, unknown>
    >,
    clipPropName: string,
    val = '1',
  ) => {
    const input = wrapper.find({ name: clipPropName });

    expect(input).toHaveLength(1);

    input.props().onChange({
      target: { name: clipPropName, value: val },
    });
  };

  it('should set clip width but not call onChange and show required field error', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'width');

    expect(changeMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(Typography).text()).toBe(errorMessage);
  });

  it('should set clip height but not call onChange and show required field error', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'height');
    expect(changeMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(Typography).text()).toBe(errorMessage);
  });

  it('should set clip x but not call onChange and show required field error', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'x');
    expect(changeMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(Typography).text()).toBe(errorMessage);
  });

  it('should set clip y but not call onChange and show required field error', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'y');
    expect(changeMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(Typography).text()).toBe(errorMessage);
  });

  it('should call onChange when all required fields set', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'width');
    clipInputs(wrapper, 'height');
    clipInputs(wrapper, 'x');
    clipInputs(wrapper, 'y');
    expect(changeMock).toHaveBeenCalledWith({
      clip: { height: 1, width: 1, x: 1, y: 1 },
    });
    expect(wrapper.find(Typography)).toHaveLength(0);
  });

  it('should remove clip prop form options when all clip props empty', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotOptions
        onChange={changeMock}
        options={{
          clip: { height: 1, width: 2, x: 3, y: 4 },
          fullPage: true,
        }}
      />,
    );
    clipInputs(wrapper, 'width', '');
    clipInputs(wrapper, 'height', '');
    clipInputs(wrapper, 'x', '');
    clipInputs(wrapper, 'y', '');

    expect(changeMock).toHaveBeenCalledWith({ fullPage: true });
    expect(wrapper.find(Typography)).toHaveLength(0);
  });

  it('should handle checkbox value', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);

    const label = wrapper.find(FormControlLabel).at(0);

    expect(label).toHaveLength(1);

    const checkBox = label.props().control;

    expect(checkBox).toBeDefined();

    checkBox.props.onChange(
      {
        target: { checked: true, name: 'omitBackground', type: 'checkbox' },
      } as React.ChangeEvent<HTMLInputElement>,
      true,
    );

    expect(changeMock).toHaveBeenCalledWith({ omitBackground: true });
  });

  it(`should match width and height if they don't have value`, () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'width', '100');
    expect(wrapper.find({ name: 'height' }).props().value).toBe(100);
  });

  it(`should match height and width if they don't have value`, () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'height', '100');
    expect(wrapper.find({ name: 'width' }).props().value).toBe(100);
  });

  it(`should not match width and height after input blur`, () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);

    clipInputs(wrapper, 'width', '100');
    expect(wrapper.find({ name: 'height' }).props().value).toBe(100);

    wrapper.find({ name: 'width' }).props().onBlur();
    clipInputs(wrapper, 'width', '5');
    expect(wrapper.find({ name: 'height' }).props().value).toBe(100);
    expect(wrapper.find({ name: 'width' }).props().value).toBe(5);
  });

  it('should remove clip pops ', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotOptions
        onChange={changeMock}
        options={{ clip: { height: 1, width: 2, x: 3, y: 4 }, fullPage: true }}
      />,
    );
    wrapper.find(RestoreIcon).parent().props().onClick();
    expect(changeMock).toHaveBeenCalledWith({ fullPage: true });
  });

  it(`should not match width and height if they do have value`, () => {
    const changeMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotOptions
        onChange={changeMock}
        options={{ clip: { height: 1, width: 2, x: 3, y: 4 } }}
      />,
    );
    clipInputs(wrapper, 'width', '100');
    expect(wrapper.find({ name: 'height' }).props().value).toBe(1);
  });

  it(`should set quality prop to undefined if input value is -1 or empty string`, () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'quality', '');
    expect(changeMock).toHaveBeenCalledWith({ quality: undefined });
    clipInputs(wrapper, 'quality', '0');
    expect(changeMock).toHaveBeenCalledWith({ quality: 0 });
    clipInputs(wrapper, 'quality', '-1');
    expect(changeMock).toHaveBeenCalledWith({ quality: undefined });
  });

  it(`should clear all options`, () => {
    const changeMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotOptions
        onChange={changeMock}
        options={{ clip: { height: 1, width: 2, x: 3, y: 4 } }}
      />,
    );
    wrapper
      .find(Button)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(changeMock).toHaveBeenCalledTimes(1);
    expect(changeMock).toHaveBeenCalledWith(undefined);
  });
});
