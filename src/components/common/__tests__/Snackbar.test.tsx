import { Snackbar } from '../Snackbar';
import { shallow } from 'enzyme';
import React from 'react';
import { useSnackbar } from 'notistack';
import { AlertTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import CloseSharp from '@mui/icons-material/CloseSharp';

jest.mock('react', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
}));

describe('Snackbar', () => {
  beforeEach(() => {
    window.__visible_snackbar_messages__ = {};
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<Snackbar onClose={jest.fn()} />);
    expect(wrapper.type()).toBeNull();
  });

  it('should request snackbar', () => {
    const enqueueSnackbarMock = jest.fn();
    (useSnackbar as jest.Mock).mockImplementationOnce(() => ({
      enqueueSnackbar: enqueueSnackbarMock,
    }));
    shallow(<Snackbar onClose={jest.fn()} open={true} message="foo" />);
    const wrapper = shallow(enqueueSnackbarMock.mock.calls[0][0]);
    expect(enqueueSnackbarMock).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toBe('foo');
  });

  it('should close snackbar', () => {
    const closeSnackbar = jest.fn();
    let closeFun;
    const onCloseMock = jest.fn();
    const mockData = {
      closeSnackbar,
      enqueueSnackbar: (_e, options) => {
        closeFun = options.onClose;
        return 'key';
      },
    };
    (useSnackbar as jest.Mock)
      .mockImplementationOnce(() => mockData)
      .mockImplementationOnce(() => mockData);

    const wrapper = shallow(
      <Snackbar onClose={onCloseMock} open={true} message="foo" />,
    );

    wrapper.setProps({ open: false });
    closeFun();

    expect(closeSnackbar).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should replace "\n" with div', () => {
    const enqueueSnackbarMock = jest.fn();
    (useSnackbar as jest.Mock).mockImplementationOnce(() => ({
      enqueueSnackbar: enqueueSnackbarMock,
    }));
    shallow(<Snackbar onClose={jest.fn()} open={true} message={`foo\nbar`} />);
    const wrapper = shallow(enqueueSnackbarMock.mock.calls[0][0]);

    expect(wrapper.find('div')).toHaveLength(3);
  });

  it('should have title', () => {
    const enqueueSnackbarMock = jest.fn();
    (useSnackbar as jest.Mock).mockImplementationOnce(() => ({
      enqueueSnackbar: enqueueSnackbarMock,
    }));
    shallow(
      <Snackbar
        onClose={jest.fn()}
        open={true}
        message={`foo`}
        title="title"
      />,
    );
    const wrapper = shallow(enqueueSnackbarMock.mock.calls[0][0]);
    expect(wrapper.find(AlertTitle)).toHaveLength(1);
  });

  it('should render children and', () => {
    const enqueueSnackbarMock = jest.fn();
    (useSnackbar as jest.Mock).mockImplementationOnce(() => ({
      enqueueSnackbar: enqueueSnackbarMock,
    }));
    shallow(
      <Snackbar onClose={jest.fn()} open={true}>
        <DialogContent>tets</DialogContent>
      </Snackbar>,
    );
    const wrapper = shallow(enqueueSnackbarMock.mock.calls[0][0]);
    expect(wrapper.find(DialogContent)).toHaveLength(1);
  });

  it('should have close icon and close', () => {
    const enqueueSnackbarMock = jest.fn();
    const closeSnackbar = jest.fn();
    (useSnackbar as jest.Mock).mockImplementationOnce(() => ({
      closeSnackbar,
      enqueueSnackbar: enqueueSnackbarMock,
    }));
    shallow(
      <Snackbar onClose={jest.fn()} open={true} closeIcon={true}>
        <DialogContent>tets</DialogContent>
      </Snackbar>,
    );
    const wrapper = shallow(enqueueSnackbarMock.mock.calls[0][0]);
    expect(wrapper.find(CloseSharp)).toHaveLength(1);
    wrapper
      .find(CloseSharp)
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);
    expect(closeSnackbar).toHaveBeenCalledTimes(1);
  });

  it('should not show duplicates when rerender', () => {
    const wrapper = shallow(
      <Snackbar onClose={jest.fn()} open={true} message="foo" />,
    );

    expect(window.__visible_snackbar_messages__).toStrictEqual({
      '6962551387d6f2c27805853f21c1dd714eb41a3e': true,
    });

    wrapper.setProps({ closeIcon: false });

    expect(window.__visible_snackbar_messages__).toStrictEqual({
      '6962551387d6f2c27805853f21c1dd714eb41a3e': true,
    });
  });
});
