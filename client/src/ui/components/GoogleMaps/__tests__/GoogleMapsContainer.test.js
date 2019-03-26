import React from 'react';
import Enzyme from 'enzyme';
import {shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import sinon from 'sinon';
import { GoogleMapsContainer } from '../GoogleMapsContainer.js';
import { InfoWindow, Map, Marker } from 'google-maps-react';

Enzyme.configure({ adapter: new Adapter() });

describe('GoogleMapsContainer', () => {

    it('renders without crashing', () => {
      const wrapper = shallow(<GoogleMapsContainer />)
    })

    it('checks default values', () => {
        const wrapper = shallow(<GoogleMapsContainer />);
        expect(wrapper.state().showingInfoWindow).to.equal(false);
    });

    it('allows us to set props', () => {
      const wrapper = mount(<GoogleMapsContainer field="test" />);
      expect(wrapper.props().field).to.equal('test');
      wrapper.setProps({ field: 'change' });
      expect(wrapper.props().field).to.equal('change');
    });

    it('simulates onMapClick', () => {
      const props = {
          lat: 34, 
          lng: 34, 
          title: 'testProd', 
          adress: 'Oslo', 
          sellerUid:'test'
        }
      const onMapClick = sinon.spy();
      const wrapper = mount((
        <GoogleMapsContainer onMapClick={onMapClick} {...props} />
      ));
      wrapper.setState({showingInfoWindow: true});
      expect(wrapper.state().showingInfoWindow).to.equal(true);
      expect(wrapper.find(Map)).to.have.lengthOf(1);
      wrapper.find(Map).simulate('click');
      expect(wrapper.state().showingInfoWindow).to.equal(true);
    });

   it('renders one Map, Marker and InfoWindow', () => {
      const wrapper = mount(<GoogleMapsContainer />);
      expect(wrapper.find(Map)).to.have.lengthOf(1);
      expect(wrapper.find(Marker)).to.have.lengthOf(1);
      expect(wrapper.find(InfoWindow)).to.have.lengthOf(1);
    });
});