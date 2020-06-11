import { ScreenshotOptions } from '../ScreenshotOptions';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
// import { TextField } from '@material-ui/core';

describe('ScreenshotOptions', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotOptions onChange={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  // it('should have defaults', () => {
  //   const wrapper = shallow(
  //     <ScreenshotOptions
  //       onChange={jest.fn()}
  //       options={{
  //         clip: { height: 1, width: 2, x: 3, y: 4 },
  //         fullPage: true,
  //         omitBackground: true,
  //         quality: 1,
  //         type: 'jpeg',
  //       }}
  //     />,
  //   );
  //   expect(wrapper).toMatchSnapshot();
  // });

  const clipInputs = (
    wrapper: ShallowWrapper<
      unknown,
      Readonly<{}>,
      React.Component<{}, {}, unknown>
    >,
    clipPropName: string,
  ) => {
    const input = wrapper.find({ name: clipPropName });

    expect(input).toHaveLength(1);

    input.props().onChange({
      target: { name: clipPropName, value: 1 },
    });

    expect(wrapper.find({ name: clipPropName }).props().value).toBe(1);
  };

  it('should set clip width but not call onChange', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    clipInputs(wrapper, 'width');

    expect(changeMock).toHaveBeenCalledTimes(1);
    expect(changeMock).toHaveBeenCalledWith(undefined);
  });

  // it('should set clip height but not call onChange', () => {
  //   const changeMock = jest.fn();
  //   const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
  //   clipInputs(wrapper, 'height');
  //   expect(changeMock).toHaveBeenCalledTimes(0);
  // });

  // it('should set clip x but not call onChange', () => {
  //   const changeMock = jest.fn();
  //   const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
  //   clipInputs(wrapper, 'x');
  //   expect(changeMock).toHaveBeenCalledTimes(0);
  // });

  // it('should set clip y but not call onChange', () => {
  //   const changeMock = jest.fn();
  //   const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
  //   clipInputs(wrapper, 'y');
  //   expect(changeMock).toHaveBeenCalledTimes(0);
  // });

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
  });
});
