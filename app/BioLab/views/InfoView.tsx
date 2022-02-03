import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  NativeModules,
  NativeEventEmitter,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

export default class InfoView extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          height: Dimensions.get('window').height,
        }}>
        <Image
          style={{
            resizeMode: 'contain',
            maxHeight: '100%',
            maxWidth: '100%',
          }}
          source={require('../assets/InfoPage.png')}
        />
      </ScrollView>
    );
  }
}
