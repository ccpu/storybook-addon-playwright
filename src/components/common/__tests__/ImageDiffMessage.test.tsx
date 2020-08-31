import { ImageDiffMessage } from '../ImageDiffMessage';
import '../../../../__manual_mocks__/react-useEffect';
import { shallow } from 'enzyme';
import React from 'react';
import { ImageDiffPreviewDialog } from '../ImageDiffPreviewDialog';
import { mocked } from 'ts-jest/utils';
import { useSnackbar } from '../../../hooks/use-snackbar';

jest.mock('../../../hooks/use-snackbar');

const openSnackbarMock = jest.fn();

mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

describe('ImageDiffMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing if result undefined', () => {
    const wrapper = shallow(
      <ImageDiffMessage result={undefined} onClose={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(openSnackbarMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(0);
  });

  it('should show message for added screenshot', () => {
    const wrapper = shallow(
      <ImageDiffMessage result={{ added: true }} onClose={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(openSnackbarMock.mock.calls[0][0]).toBe(
      'Screenshot  saved successfully.',
    );
  });

  it('should screenshot image diff successfully passed snackbar', () => {
    shallow(<ImageDiffMessage result={{ pass: true }} onClose={jest.fn()} />);

    expect(openSnackbarMock.mock.calls[0][0]).toBe(
      'Testing existing screenshot were successful, no change has been detected.',
    );
  });

  it('should show error message if found image size difference', () => {
    shallow(
      <ImageDiffMessage
        result={{
          diffSize: true,
          imageDimensions: {
            baselineHeight: 20,
            baselineWidth: 20,
            receivedHeight: 10,
            receivedWidth: 10,
          },
          pass: false,
        }}
        onClose={jest.fn()}
      />,
    );

    expect(openSnackbarMock.mock.calls[0][0]).toBe(
      'Expected image to be the same size as the snapshot (20x20), but was different (10x10).',
    );
  });

  it('should show/close ImageDiffPreviewDialog found difference', () => {
    const onCloseMock = jest.fn();
    const wrapper = shallow(
      <ImageDiffMessage
        result={{
          pass: false,
        }}
        onClose={onCloseMock}
      />,
    );

    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(1);
    wrapper.props().onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
