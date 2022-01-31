import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';

import { mainStyle, measureStyle, settingsStyle } from '../styles/style';

export default class Measure extends Component<{ navigation: any }> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <View style={measureStyle.menuContainer}>
        {/* Hier komt de body van de pagina */}
        <Image
          style={measureStyle.backgroundLogo}
          source={require('../assets/Analyze_backgroundLogo.png')}
        />
        <View style={measureStyle.contentContainer}>
          <View style={measureStyle.measureRow}>
            <Text style={measureStyle.subTitle}>Measure with:</Text>
          </View>

          <View style={measureStyle.row}>
            <TouchableHighlight
              activeOpacity={0.5}
              onPress={() => this.props.navigation.navigate('Device', {})}
              underlayColor="rgba(255,255,255,0)">
              <Image
                source={require('../assets/incubatorChoice.png')}
                style={measureStyle.images}
              />
            </TouchableHighlight>
            <TouchableHighlight
              activeOpacity={0.5}
              onPress={() => this.props.navigation.navigate('Camera', {})}
              underlayColor="rgba(255,255,255,0)">
              <Image
                source={require('../assets/cameraChoice.png')}
                style={measureStyle.images}></Image>
            </TouchableHighlight>
          </View>
          <View style={measureStyle.row}>
            <Text style={measureStyle.choiceText}>External</Text>
            <Text style={measureStyle.choiceText}>Internal</Text>
          </View>

          <View style={settingsStyle.settingsBox}>
            <Text style={settingsStyle.info}>Change your preferences in:</Text>
            <TouchableHighlight
              activeOpacity={0.5}
              onPress={() => this.props.navigation.navigate('SettingsUser', {})}
              underlayColor="rgba(255,255,255,0)">
              <Text style={settingsStyle.info}>Settings: Preferences</Text>
          </TouchableHighlight>
        </View>


      </View>
      </View >
    );
  }
}
