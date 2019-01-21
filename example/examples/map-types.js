import React, { Component } from 'react'
import { StyleSheet, Picker } from 'react-native'
import { MapView } from 'react-native-amap3d'

export default class MapTypesExample extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation
    state.params = state.params || { mapType: 'standard' }
    const props = {
      mode: 'dropdown',
      style: { width: 100 },
      selectedValue: state.params.mapType,
      onValueChange: mapType => setParams({ mapType }),
    }
    return {
      title: '地图模式',
      headerRight: (
        <Picker {...props}>
          <Picker.Item label="标准" value="standard" />
          <Picker.Item label="卫星" value="satellite" />
          <Picker.Item label="导航" value="navigation" />
          <Picker.Item label="夜间" value="night" />
          <Picker.Item label="公交" value="bus" />
        </Picker>
      ),
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 30,
        longitude: 120,
        latitudeDelta: 1,
        longitudeDelta: 1,
      },
      coordinate: {
        latitude: 30,
        longitude: 120,
      },
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        region: null,
        coordinate: undefined,
      });
    }, 2000);
  }

  render() {
    return (
      <MapView
        region={this.state.region}
        coordinate={this.state.coordinate}
        mapType={this.props.navigation.state.params.mapType}
        style={StyleSheet.absoluteFill}
      />
    )
  }
}
