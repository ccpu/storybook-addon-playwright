import '../../../../__manual_mocks__/react-useEffect';
import { CommonProvider } from '../CommonProvider';
import { shallow } from 'enzyme';
import React from 'react';

describe('CommonProvider', () => {
  it('should render', () => {
    const wrapper = shallow(
      <CommonProvider>
        <div>test</div>
      </CommonProvider>,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
