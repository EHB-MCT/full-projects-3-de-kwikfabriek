import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Switch, NativeModules, NativeEventEmitter, Image, } from 'react-native';

export default class InfoView extends Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          {/* Hier kunnen er knoppen komen */}
        </View>
        <Image
          source={require('../assets/Info_page.png')} />

      </View>
    )
  }

}

// voorlopige stijlen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  }
});