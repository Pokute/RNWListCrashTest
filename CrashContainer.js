'use strict';

import React, {
	Component,
} from 'react';
import {
	View,
} from 'react-native';

import EmptyAnimated from './EmptyAnimated';
import { DynamicWidget } from './DynamicWidget';

class CrashContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={ { flex: 1, backgroundColor: '#FFFFFF' } }>
				<View style={{ flex:1 }}>
					<DynamicWidget
						ref='quickGame'
						game={ this.props.game }
						quickGame={ true }
						split={ false }
						onChange={ this.onGameChange.bind(this) }
					/>
					<EmptyAnimated />
				</View>
			</View>
		);
	}
	
	onGameChange(play) {
		this.setState({ bar: Math.random()});
	}
}

module.exports = CrashContainer;
