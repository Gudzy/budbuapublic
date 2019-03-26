import React from 'react';
import {Market} from '../../Market/Market.js';
import Enzyme from 'enzyme';
import {shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import sinon from 'sinon';
import IconLabelButtons from '../../Buttons/IconLabelButtons';
import { shape } from 'prop-types';

Enzyme.configure({ adapter: new Adapter() });

describe('Market', () => {

    it('renders without crashing', () => {
      const wrapper = shallow(<Market />, options)
    })

    it('checks default values', () => {
        const wrapper = shallow(<Market />, options);
        expect(wrapper.state().finishTime).to.equal('20:00');
        expect(wrapper.state().error).to.equal(false);
        expect(wrapper.state().products).to.have.length(0);
    });

    it('allows us to set props', () => {
      const wrapper = mount(<Market field="test" />, options);
      expect(wrapper.props().field).to.equal('test');
      wrapper.setProps({ field: 'change' });
      expect(wrapper.props().field).to.equal('change');
    });

    it('simulates call componentDidMount', () => {
      sinon.spy(Market.prototype, 'componentDidMount');
      const wrapper = mount(<Market />, options);
      expect(Market.prototype.componentDidMount).to.have.property('callCount', 1);
      Market.prototype.componentDidMount.restore();
    });

    it('simulates add product click', () => {
      const props ={
        isAuthenticated : true
      }
      const onButtonClick = sinon.spy();
      const wrapper = mount((
        <Market onButtonClick={onButtonClick} {...props} />
      ), options);
      expect(wrapper.state().add).to.equal(false);
      wrapper.find({id : "addButton"}).first().simulate('click');
      expect(wrapper.state().add).to.equal(true);
    });

    it('renders two IconLabelButtons', () => {
      const wrapper = mount(<Market />, options);
      expect(wrapper.find(IconLabelButtons)).to.have.length(2);
    });
});

const options = {
  context: {
    router: {
      history: {
        push: jest.fn(),
        replace: jest.fn(),
        createHref: jest.fn(),
      },
      route: {
        location: {
          hash: '',
          pathname: '',
          search: '',
          state: '',
        },
        match: {
          params: {},
          isExact: false,
          path: '',
          url: '',
        },
      },
    },
  },
  childContextTypes: {
    router: shape({
      route: shape({
        location: shape({}),
        match: shape({}),
      }),
      history: shape({}),
    }),
  },
};