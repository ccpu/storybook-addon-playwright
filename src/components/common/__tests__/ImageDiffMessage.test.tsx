import { ImageDiffMessage } from '../ImageDiffMessage';
import { shallow } from 'enzyme';
import React from 'react';
import { Snackbar } from '../Snackbar';
import { ImageDiffPreviewDialog } from '../ImageDiffPreviewDialog';

describe('ImageDiffMessage', () => {
  it('should render nothing if screenshot just added', () => {
    const wrapper = shallow(
      <ImageDiffMessage result={{ added: true }} onClose={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should screenshot image diff successfully passed snackbar', () => {
    const wrapper = shallow(
      <ImageDiffMessage result={{ pass: true }} onClose={jest.fn()} />,
    );
    expect(
      wrapper
        .find(Snackbar)
        .props()
        .message.startsWith('Testing existing screenshot were successful'),
    ).toBe(true);
  });

  it('should show error message if found image size difference', () => {
    const wrapper = shallow(
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

    expect(wrapper.find(Snackbar).props().message).toBe(
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
