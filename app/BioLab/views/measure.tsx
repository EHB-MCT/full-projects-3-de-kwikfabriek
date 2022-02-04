import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  ColorValue,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import { mainStyle, measureStyle, settingsStyle } from '../styles/style';
import Server from '../functions/Server';

const userName = 'Matthias';

export default class Measure extends Component<
  { route: any, navigation: any },
  {
    locationArray: any[];
    locationChosen: Boolean;
    chosenLocation: any[];
    setLocationName: String;
    pinName: String;
    sendingLocationData: any[];
  }
> {

  server: Server

  constructor(props: any) {
    super(props);
    this.server = this.props.route.params.server;
    this.state = {
      locationArray: [] as any,
      locationChosen: false,
      chosenLocation: [],
      setLocationName: '',
      pinName: '',
      sendingLocationData: [] as any,
    };
    this.displayLocationPins();
  }


  displayLocationPins() {
    let data = {
      userName: "Matthias"
    }
    this.server.fetchData("location", "get", data, true).then((response: any) => {
      console.log(response);
      this.setState({ locationArray: [] });
      JSON.parse(response).forEach((el: any) => {
        console.log(el);
        this.state.locationArray.push(
          // {
          //   id: el.id,
          //   locationName: el.locationName
          // }
          <View style={measureStyle.singleLocationContainer} key={el.id}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ setLocationName: el.locationName });
                this.chooseLocationPin();
                this.setState({
                  sendingLocationData: [
                    el.id,
                    el.userName,
                    el.locationName,
                    el.location,
                  ],
                });
              }}
              style={measureStyle.singleLocationButton}>
              <Text style={measureStyle.singleLocationText}>
                {el.locationName}
              </Text>
            </TouchableOpacity>
          </View>,
        );
      });
      console.log(this.state.locationArray);
      this.setState({});
    });
  }


  chooseLocationPin() {
    this.setState({ locationChosen: true });
  }

  render() {
    return (
      <View style={measureStyle.mainContainer}>
        {!this.state.locationChosen ? (
          <ImageBackground source={require('../assets/backgroundWavy.png')}>
            <ScrollView
              contentContainerStyle={
                (measureStyle.menuContainer, { flexGrow: 1 })
              }>
              <View style={measureStyle.topTextLocation}>
                <Text style={measureStyle.topTextLocationText}>
                  Choose your sample location or type in a custom location:
                </Text>
              </View>
              <View style={measureStyle.newLocationCont}>
                <TouchableOpacity
                  style={measureStyle.newLocationButton}
                  onPress={() =>
                    this.props.navigation.navigate('LocationPin', {})
                  }>
                  <Text style={measureStyle.newLocationText}>
                    Add new location
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={measureStyle.locationContainer}>
                {this.state.locationArray}
              </View>
              <View style={measureStyle.chooseLocationCont}>
                <Text style={measureStyle.chooseLocationText}>
                  Choose your own location:
                </Text>
                <TextInput
                  onChangeText={e => {
                    this.setState({ pinName: e });
                  }}
                  value={this.state.pinName}
                  style={measureStyle.chooseLocationTextInput}></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    console.log(this.state.pinName);
                    this.setState({ setLocationName: this.state.pinName });
                    this.chooseLocationPin();
                  }}
                  style={measureStyle.chooseLocationButton}>
                  <Text style={measureStyle.chooseLocationText}>
                    Submit custom location
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
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
                  onPress={() => {
                    console.log(this.state.sendingLocationData);
                    this.props.navigation.navigate('Device', {
                      sendingLocationData: this.state.sendingLocationData,
                    });
                  }}
                  underlayColor="rgba(255,255,255,0)">
                  <Image
                    source={require('../assets/incubatorChoice.png')}
                    style={measureStyle.images}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={0.5}
                  onPress={() => {
                    console.log(this.state.sendingLocationData);
                    this.props.navigation.navigate('Camera', {
                      sendingLocationData: this.state.sendingLocationData,
                    });
                  }}
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

              <View style={measureStyle.currentLocationContainer}>
                <Text style={measureStyle.currentLocationText}>
                  Your current location is: {this.state.setLocationName}
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ locationChosen: false })} style={measureStyle.currentLocationChangeButton}>
                  <Text style={measureStyle.currentLocationText}>
                    Change location
                  </Text>
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
