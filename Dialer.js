'use strict';
import {
	Animated,
	Text,
	TextInput,
	TouchableHighlight,
	View,
} from 'react-native';

import React, {
	Component,
} from 'react';

class Dialer extends Component {
	constructor(props) {
		super(props);
		let value = this.props.value || 0;
		this.state = {
			value: value,
			step: this.props.step || 1,
			subDisabled: value == this.props.min || this.props.disabled,
			addDisabled: value == this.props.max || this.props.disabled,
			supportsStakeTextInput: this.props.supportsStakeTextInput,
			textInputValue: '',
		};
	}

	componentDidMount() {
		if (this.state.value == this.props.min) {
			this.setState({
				subDisabled: true,
			});
		}
		else if (this.state.value == this.props.max) {
			this.setState({
				addDisabled: true,
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		let value = nextProps.value;
		if (value < nextProps.min) {
			value = nextProps.min
		}
		else if (value > nextProps.max) {
			value = nextProps.max;
		}
		this.setState({
			value: value,
			step: nextProps.step || 1,
			subDisabled: value == nextProps.min || nextProps.disabled,
			addDisabled: value == nextProps.max || nextProps.disabled,
			textInputValue: value
		});
	}
	
	shouldComponentUpdate(props, state) {
		return true;
	}

	render() {
		return (
			<View style={[ this.props.style, { flexDirection: 'row', margin: 10} ]}>
				<TouchableHighlight
					onPress={ this.onSubstract.bind(this) }
				>
					<View style={ [ { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }, this.props.color && { backgroundColor: this.props.color }, {paddingBottom: 5}] }>
						<Text allowFontScaling={ false }  style={ [ this.props.textColor && { color: this.props.textColor }] }>-</Text>
					</View>
				</TouchableHighlight>
				<View>
					{ this.state.supportsStakeTextInput? (
						<TextInput allowFontScaling={ false }
							ref='input'
							keyboardType='numeric'
							editable={ !this.props.disabled }
							underlineColorAndroid='transparent'
							onEndEditing={(val) => { this.validateAndSetInput(val); this.setState({ editing: false }); }}
							onFocus={() => { this.setState({editing: true, textInputValue: ''}); this.inputFocused(true) }}
							onBlur={() => { this.inputFocused(false); }}
							onSubmitEditing={(val) => { this.validateAndSetInput(val); this.setState({ editing: false }); }}
							onChangeText={ (val) => { this.setState({editing: true}); this.updateAndValidateInput(val); }}
							value={ !this.state.editing ? this.props.renderValue(this.state.value === null ? '' : this.state.value.toString()) : this.state.textInputValue }
						/>
					) : (<Text allowFontScaling={ false }>{ this.props.renderValue ? this.props.renderValue(this.state.value) : this.state.value }</Text>) }
				</View>
				<TouchableHighlight
					onPress={ this.onAdd.bind(this) }
				>
					<View style={ [{borderTopRightRadius: 5, borderBottomRightRadius: 5}, this.props.color && { backgroundColor: this.props.color }] }>
						<Text allowFontScaling={ false }  style={ [this.props.textColor && { color: this.props.textColor }] }>+</Text>
					</View>
				</TouchableHighlight>
			</View>
		);
	}

	inputFocused(hasFocus) {
		if (this.props.onFocus) {
			this.props.onFocus({
				input: this.refs.input,
				focused: hasFocus,
			});
		}
	}

	validateAndSetInput(val) {
		let integerStake = Math.round((parseFloat(val.nativeEvent.text.replace(/[^0-9.,]/g, '').replace(',', '.')) * 100));
		if (this.props.precision) {
			integerStake = Math.round(integerStake / this.props.precision) * this.props.precision;
		}
		val = integerStake;

		if (val < this.props.min) {
 			val = this.props.min;
		}
 		if (val > this.props.max) {
 			val = this.props.max;
 		}

		if (!val) val = 0;

		if (this.props.onChange) {
 			this.props.onChange(val, 'user');
 		}

		this.setState({textInputValue: null});
	}

	updateAndValidateInput(value) {
		value = value.replace(/[^0-9.,]/g, "");

		let val = value.replace('.', ',');
		let values = val.split(',');

		if (values.length > 1) {
			val = values[0];
			val += values[1];
		} else
			val = value;

		this.setState({textInputValue: value});
	}

	onSubstract() {
		if (this.state.subDisabled) {
			return;
		}

		let value = this.state.value - this.state.step;

		if (this.props.onChange) {
			this.props.onChange(value, 'sub');
		}
	}

	onAdd() {
		if (this.state.addDisabled) {
			return;
		}
		let value = this.state.value + this.state.step;

		if (value < this.props.min) {
			value = this.props.min;
		}
		if (value > this.props.max) {
			value = this.props.max;
		}

		if (this.props.onChange) {
			this.props.onChange(value, 'add');
		}
	}
}

module.exports = Dialer;
