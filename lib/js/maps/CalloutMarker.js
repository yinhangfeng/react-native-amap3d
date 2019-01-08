import React from 'react';
import { Platform, requireNativeComponent, StyleSheet, View } from 'react-native';
import Component from '../Component';

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
    paddingTop: '60%',
  },
});

const AMapMarker = requireNativeComponent('AMapMarker');

export default class CalloutMarker extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (Platform.OS === 'android') {
      setTimeout(() => this.sendCommand('update'), 0);
    }
  }

  render() {
    const { calloutView, offset, coordinate } = this.props;

    return (
      <AMapMarker coordinate={coordinate} zIndex={99999} clickDisabled infoWindowDisabled>
        <View pointerEvents="box-none" style={styles.callout}>
          <View
            pointerEvents="box-none"
            style={{
              bottom: '50%',
              paddingBottom: offset,
            }}
          >
            {calloutView}
          </View>
        </View>
      </AMapMarker>
    );
  }
}
