import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import {mainStyle, measureStyle, settingsStyle} from '../styles/style';

const userName = 'Matthias';

export default class Measure extends Component<
  {navigation: any},
  {
    locationArray: any[];
    locationChosen: Boolean;
    chosenLocation: any[];
    setLocationName: String;
    pinName: String;
    sendingLocationData: any[];
  }
> {
  constructor(props: any) {
    super(props);
    this.displayLocationPins();
  }

  state = {
    locationArray: [] as any,
    locationChosen: false,
    chosenLocation: [],
    setLocationName: '',
    pinName: '',
    sendingLocationData: [],
  };

  displayLocationPins() {
    RNFetchBlob.fetch('GET', `http://10.3.208.84:8100/location/${userName}`, {
      'Content-Type': 'application/json',
    }).then(res => {
      this.setState({locationArray: []});
      JSON.parse(res.data).forEach((el: any) => {
        console.log(el);
        this.state.locationArray.push(
          // {
          //   id: el.id,
          //   locationName: el.locationName
          // }
          <View key={el.id}>
            <TouchableOpacity
              onPress={() => {
                this.chooseLocationPin();
                this.setState({setLocationName: el.locationName});
              }}>
              <Text>{el.locationName}</Text>
            </TouchableOpacity>
          </View>,
        );
      });
      console.log(this.state.locationArray);
      this.setState({});
    });
  }

  chooseLocationPin() {
    this.setState({locationChosen: true});
  }

  render() {
    return (
      <View style={measureStyle.menuContainer}>
        {!this.state.locationChosen ? (
          <>
            <View>
              <Text>
                Choose your sample location or type in a custom location:
              </Text>
            </View>
            <View>{this.state.locationArray}</View>
            <View>
              <Text>Choose your own location:</Text>
              <TextInput
                onChangeText={e => {
                  this.setState({pinName: e});
                }}
                value={this.state.pinName}></TextInput>
              <TouchableOpacity
                onPress={() => {
                  this.setState({setLocationName: this.state.pinName});
                  this.chooseLocationPin();
                }}>
                <Text>Submit custom location</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
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
                  onPress={() =>
                    this.props.navigation.navigate('Device', {
                      sendingLocationData: this.state.setLocationName,
                    })
                  }
                  underlayColor="rgba(255,255,255,0)">
                  <Image
                    source={require('../assets/incubatorChoice.png')}
                    style={measureStyle.images}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={0.5}
                  onPress={() =>
                    this.props.navigation.navigate('Camera', {
                      sendingLocationData: this.state.setLocationName,
                    })
                  }
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

              <View>
                <Text>
                  Your current location is: {this.state.setLocationName}
                </Text>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => this.setState({locationChosen: false})}>
                  <Text>Change location</Text>
                </TouchableOpacity>
              </View>

              <View style={settingsStyle.settingsBox}>
                <Text style={settingsStyle.info}>
                  Change your preferences in:
                </Text>
                <TouchableHighlight
                  activeOpacity={0.5}
                  onPress={() =>
                    this.props.navigation.navigate('SettingsUser', {})
                  }
                  underlayColor="rgba(255,255,255,0)">
                  <Text style={settingsStyle.info}>Settings: Preferences</Text>
                </TouchableHighlight>
              </View>
            </View>
          </>
        )}
      </View>
    );
  }
}
