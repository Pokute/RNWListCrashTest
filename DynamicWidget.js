'use strict'

import {
	Alert,
	Animated,
	Image,
	LayoutAnimation,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';

import React, {
	Component,
	PropTypes,
} from 'react';

import Dialer from './Dialer';

const RowAnimation = {
	duration: 250,
	create: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 0.9,
	},
	update: {
		type: LayoutAnimation.Types.linear,
		springDamping: 0.9,
	},
};

class DynamicWidget extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showRows: true,
			rows: [],
			rowsAnim: new Animated.Value(0),
			rowsVisible: true,
			multiplier: false,
			quickGame: true,
		};
	}

	componentWillMount() {
		try {
			this.state.rowsAnim.addListener((event) => {
				if (event.value == 1) {
					this.setState({ rowsVisible: false });
					this.state.rowsAnim.setValue(0);
				}
			});
		} catch (exception) {
			console.log(exception);
		}
	}

	componentWillReceiveProps(nextProps) {
		try {
			if (nextProps.game != this.props.game) {
				this.onRows(0);
				this.setState({
					stake: nextProps.game.initialStake,
					multiplier: false,
					rowsVisible: false,
				});
			}
		} catch (exception) {
			console.log(exception);
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Dialer
					ref='rowDial'
					value={ this.state.rows.length }
					min={ 0 }
					max={ 20 }
					onChange={ (value) => { this.onRows(value); } }
				/>
				<Animated.View>
					<View style={ { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' } }>
						<View style={ {
							flex: 0,
							flexDirection: 'column',
							justifyContent: 'flex-start',
							alignItems: 'stretch',
							alignSelf: 'stretch',
						}}>
							{ this.state.rows.map((v, rownum) => {
								return (
									<View
										key={ rownum }
										style={
											{
												flex: 0,
												flexDirection: 'row',
												flexWrap: 'wrap',
												justifyContent: 'flex-start',
												alignItems: 'flex-start',
												paddingVertical: 4,
												backgroundColor: 'transparent', 
												thispaddingLeft: 10
											} }
									>
										<View>
											<Text>{ rownum+1 + '.' }</Text>
										</View>
										<View style={{
											flex: 0,
											flexDirection: 'row',
											flexWrap: 'wrap',
											justifyContent: 'flex-start',
											alignItems: 'flex-start',
											paddingVertical: 4,
											 marginLeft: 5
										}}>
										{ Array(5).fill({}).map((v, col) => {
											return (
												<View key={ col }>
													<Text>{col}</Text>
												</View>
											);
										}) }
										</View>
									</View>
								);
							}) }
						</View>
						<View style={ { justifyContent: 'space-around' } }>
						{ this.state.rows.map((row, index) => {
							return (
								<View key={'row_'+index} style={ { flex: 1 }}>
									<TouchableHighlight
										onPress={ () => { this.removeRow(index); } }
									>
										<Text>Remove</Text>
									</TouchableHighlight>
								</View>
							);
						}) }
						</View>
					</View>
				</Animated.View>
			</View>
		);
	}

	randomArray(start, end, length, options) {
		options = options || {};

		var values = [];
		var choices = [];
		for (var i = start; i < end + 1; i++) {
			choices.push(i);
		}
		var index;
		for (var i = 0; i < length; i++) {
			index = Math.round(Math.random() * (choices.length - 1));
			values.push(choices[index]);
			if (!options.keep) {
				choices.splice(index, 1);
			}
		}
		if (options.sort) {
			values.sort(options.sort);
		}
		return values;
	}

	randomize(game, forceStake) {
		game = game || this.props.game;
		let values = {};
		let options = {
			sort: (a, b) => {
				if (a > b) {
					return 1;
				}
				if (a < b) {
					return -1;
				}
				return 0;
			}
		};

		values.primarySelections = this.randomArray(1, 48, 6, options);
//		values.price = game.basePrice;
//		values.multiplied = game.basePrice + game.multiplierPrice;

		return values;
	}
	
	updateRow(index, values) {
		if (index > this.state.rows.length - 1) {
			index = this.state.rows.length;
		}
		values = values || this.randomize();
		let rows = this.state.rows;
		rows[index] = values;
		this.setState({ rows: rows }, () => {
			this.onRows(rows.length);
		});
	}
	
	removeRow(index) {
		if (index > this.state.rows.length - 1) {
			return;
		}
		let rows = this.state.rows;
		rows.splice(index, 1);
		this.setState({ rows: rows }, () => {
			this.onRows(rows.length);
		});
	}

	onRows(count, event) {
		if (count < this.state.rows.length) {
			rows = this.state.rows.slice(0, count - this.state.rows.length);
		}
		else {
			var rows = [];
			for (var i = 0; i < count - this.state.rows.length; i++) {
				var row = this.randomize();
				rows.push(row);
			}
			rows = this.state.rows.concat(rows);
		}
		
		if (rows.length != this.state.rows.length) {
			LayoutAnimation.configureNext(RowAnimation);
		}
		this.setState({
			rows: rows,
		}, () => {
			if (this.props.onChange) {
				this.props.onChange(this);
			}
			if (this.state.showRows) {
				this.onToggleRows(true);
			}
		});
	}

	// DISABLED
	onToggleRows(force) {
		var show = typeof force == 'undefined' ? !this.state.showRows : force;
		var splitRowMultiplier = this.props.split ? 3 : 1;
		this.setState({
			showRows: show,
			rowsVisible: show ? true : this.state.rowsVisible,
		});
	}
}

module.exports = {
	DynamicWidget
};
