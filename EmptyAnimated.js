import React, { Component, PropTypes } from 'react';
import {
	LayoutAnimation,
} from 'react-native';
/*
import { connect } from 'react-redux';

import { mapDispatch } from './App';
*/
export default class PaymentView extends Component {
	
	constructor(props) {
		super(props);
		this.componentWillReceiveProps(this.props);
	}
	
	componentWillReceiveProps(props) {
		this.setState({foo: Math.random()});
	}
	
	componentWillUpdate(props, state) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}
	
	render() {
		return null;
	}
}
/*
const mapState = function (state) {
	return { };
}

export default connect(mapState, mapDispatch)(PaymentView);
*/