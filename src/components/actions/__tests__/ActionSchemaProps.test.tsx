import { ActionSchemaProps } from '../ActionSchemaProps';
import { shallow } from 'enzyme';
import React from 'react';
describe('ActionSchemaProps', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionSchemaProps
        actionId="action-id"
        schemaProps={{ name: 'schema-name' }}
        actionSetId="action-set-id"
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
