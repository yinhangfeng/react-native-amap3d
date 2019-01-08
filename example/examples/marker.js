import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapView } from 'react-native-amap3d';

const styles = StyleSheet.create({
  customIcon: {
    width: 40,
    height: 40,
  },
  customInfoWindow: {
    backgroundColor: '#8bc34a',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#689F38',
    marginBottom: 5,
  },
  customMarker: {
    backgroundColor: '#009688',
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
  },
  markerText: {
    color: '#fff',
  },
});

export default class MarkerExample extends Component {
  static navigationOptions = {
    title: '添加标记',
  };

  state = {
    time: new Date(),
  };

  componentDidMount() {
    this.mounted = true;
    // setInterval(() => {
    //   if (this.mounted) {
    //     this.setState({ time: new Date() })
    //   }
    // }, 1000)
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  _coordinates = [
    {
      latitude: 39.806901,
      longitude: 116.397972,
    },
    {
      latitude: 39.806901,
      longitude: 116.297972,
    },
    {
      latitude: 39.906901,
      longitude: 116.397972,
    },
    {
      latitude: 39.706901,
      longitude: 116.397972,
    },
  ];

  _onMarkerPress = () => Alert.alert('onPress');
  _onInfoWindowPress = () => Alert.alert('onInfoWindowPress');
  _onDragEvent = ({ nativeEvent }) =>
    Alert.alert(`${nativeEvent.latitude}, ${nativeEvent.longitude}`);

  render() {
    return (
      <MapView style={StyleSheet.absoluteFill}>
        <MapView.Marker
          active
          draggable
          title="一个可拖拽的标记"
          description={this.state.time.toLocaleTimeString()}
          onDragEnd={this._onDragEvent}
          onInfoWindowPress={this._onInfoWindowPress}
          coordinate={this._coordinates[0]}
        />
        <MapView.Marker color="green" coordinate={this._coordinates[1]} >
          <MapView.Callout>
            <TouchableOpacity activeOpacity={0.9} onPress={this._onInfoWindowPress}>
              <View style={styles.customInfoWindow}>
                <Text>自定义信息窗口</Text>
                <Text>{this.state.time.toLocaleTimeString()}</Text>
              </View>
            </TouchableOpacity>
          </MapView.Callout>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: 'rgba(200,255,200,0.4)',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ backgroundColor: 'red', width: 4, height: 4, borderRadius: 2 }} />
            <View style={{ backgroundColor: 'red', width: 4, height: 4, borderRadius: 2 }} />
            <View style={{ backgroundColor: 'red', width: 4, height: 4, borderRadius: 2 }} />
          </View>
        </MapView.Marker>

        <MapView.Marker
          color="green"
          coordinate={{
            latitude: 39.706901,
            longitude: 116.297972,
          }}
          anchor={{
            x: 0.5,
            y: 0.5,
          }}
          active
        >
          <MapView.Callout>
            <TouchableOpacity activeOpacity={0.9} onPress={this._onInfoWindowPress}>
              <View style={styles.customInfoWindow}>
                <Text>自定义信息窗口1</Text>
                <Text>{this.state.time.toLocaleTimeString()}</Text>
              </View>
            </TouchableOpacity>
          </MapView.Callout>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: 'rgba(200,255,200,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ backgroundColor: 'red', width: 4, height: 4, borderRadius: 2 }} />
          </View>
        </MapView.Marker>
        <MapView.Marker
          image="flag"
          title="自定义图片"
          onPress={this._onMarkerPress}
          coordinate={this._coordinates[2]}
        />
        <MapView.Marker
          title="自定义 View"
          icon={() => (
            <View style={styles.customMarker}>
              <Text style={styles.markerText}>{this.state.time.toLocaleTimeString()}</Text>
            </View>
           )}
          coordinate={this._coordinates[3]}
        />

        <MapView.Marker
          title="自定义 View maps 写法"
          coordinate={{
            latitude: 39.606901,
            longitude: 116.397972,
          }}
        >
          <View style={styles.customMarker}>
            <Text style={styles.markerText}>{this.state.time.toLocaleTimeString()}</Text>
          </View>
        </MapView.Marker>
      </MapView>
    );
  }
}
