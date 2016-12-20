import React, { Component } from 'react';
import {
	Animated,
	LayoutAnimation,
	AppRegistry,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	Platform,
} from 'react-native';

const ShowAnimation = {
	duration: 5000,
	create: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 0.9,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		springDamping: 0.9,
	},
};
const HideAnimation = {
	duration: 5000,
	create: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 0.95,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		springDamping: 0.95,
	},
};

export default class Crasher extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            rows: ['One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', 'One', 'Two', 'Thr', ],
        };
    }

    addRow()
    {
        this.setState({
            rows: this.state.rows.concat(['MoreRow']),
        });
    }

    removeRow(index)
    {
        let newRows = this.state.rows;
        newRows.splice(index, 1);
        this.setState({
//            rows: this.rows.slice(0, this.rows.length-1),
            rows: newRows,
        });
    }

	decreaseRows()
	{
		this.removeRow(this.state.rows.length - 1);
	}

	componentWillUpdate(props, state) {
		if ((state.rows) && (state.rows != this.state.rows)) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		}
	}

    render() {
        return (
            <View 
                style={{
                    flexDirection: 'column',
                    backgroundColor: 'red',
                }}>
				<View>
					<TouchableHighlight
						style={{
							backgroundColor: 'blue',
						}}
						onPress={this.addRow.bind(this)}
						>
						<Text>Add row</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={{
							backgroundColor: 'green',
						}}
						onPress={this.decreaseRows.bind(this)}
						>
						<Text>Rows: {this.state.rows.length}. Dec row</Text>
					</TouchableHighlight>
				</View>
                <View
                    style={{
                        flexDirection: 'row',
						flexGrow: 1,
                    }}
                    >
                    <View>
                        {this.state.rows.map((row, i) =>
                            {
                                return (
                                    <TouchableHighlight key={'left_'+i}
                                        style={{
                                            backgroundColor: 'blue',
                                        }}
                                        onPress={this.removeRow.bind(this, i)}
                                    >
										<View style={{flexDirection:'row'}}>
											<Text>Row: {i} T:{row}</Text>
											{Array(100).fill(0).map((col, i) =>
												{
													return (<Text>.</Text>);
												})}
										</View>
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </View>
                    <View>
                        {this.state.rows.map((row, i) =>
                            {
                                return (
                                    <TouchableHighlight key={'right_'+i}
                                        style={{
                                            backgroundColor: 'orange',
                                        }}
                                        onPress={this.removeRow.bind(this, i)}
                                    >
                                        <Text>{row}</Text>
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}