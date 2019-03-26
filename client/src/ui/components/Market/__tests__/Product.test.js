import React from 'react';
import {Product} from '../../Market/Product.js';

import Enzyme from 'enzyme';
import {shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

describe('Product', () => {

    it('renders without crashing', () => {
        const wrapper = shallow(<Product />)
      })

    it('checks default values', () => {
        const wrapper = shallow(<Product />);
        expect(wrapper.state().resdescription).to.equal('Beskriv problemet');
        expect(wrapper.state().error).to.equal(false);
        expect(wrapper.state().product).to.equal(null);
    });

    it('allows us to set props', () => {
      const wrapper = mount(<Product field="test" />);
      expect(wrapper.props().field).to.equal('test');
      wrapper.setProps({ field: 'change' });
      expect(wrapper.props().field).to.equal('change');
    });

});