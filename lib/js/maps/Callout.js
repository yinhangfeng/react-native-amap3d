import React from 'react';
import { View, Platform } from 'react-native';
import InfoWindow from './InfoWindow';

let Callout;
if (Platform.OS === 'android') {
  Callout = InfoWindow;
} else {
  Callout = (props) => {
    return <View {...props} />;
  };
}

export default Callout;


