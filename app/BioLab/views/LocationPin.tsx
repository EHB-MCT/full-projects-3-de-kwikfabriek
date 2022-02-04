import React, { Component } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ImageStyle,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { cameraStyle, locationPinStyle } from '../styles/style';

//Get location
import Geolocation from 'react-native-geolocation-service';

//Store location
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Server from '../functions/Server';

export default class LocationPin extends Component<
  { route: any, navigation: any },
  {
    overlayBool: Boolean;
    pinName: string;
    locationArray: any[];
    deleteOverlay: Boolean;
    deleteName: String;
    userName: String;
  }
> {

  server: Server;
  constructor(props: any) {
    super(props);
    this.server = this.props.route.params.server;
    this.test();
    this.state = {
      userName: "Sam",
      overlayBool: false,
      pinName: '',
      locationArray: [],
      deleteOverlay: false,
      deleteName: '',
    };
  }


  async test() {
    console.log("Running test function");
    this.server.fetchData("location", 'GET', "Sam", true).then((response: any) => {
      console.log("Response:", response)
      this.setState({ locationArray: [] });
      JSON.parse(response.data).forEach((el: any) => {
        console.log(el);
        this.state.locationArray.push(
          <View key={el.id} style={locationPinStyle.locationContainer}>
            <View style={locationPinStyle.locationContainerText}>
              <Text style={locationPinStyle.locationText}>
                {el.locationName}
              </Text>
            </View>
            <View style={locationPinStyle.locationContainerImage}>
              <TouchableOpacity
                style={locationPinStyle.imageButton}
                onPress={() => {
                  this.setState({ deleteName: el.locationName });
                  this.setState({ deleteOverlay: true });
                }}>
                <Image
                  style={locationPinStyle.imageStyle as ImageStyle}
                  source={require('../assets/trashIcon.png')}
                />
              </TouchableOpacity>
            </View>
          </View>,
        );
      });
      this.setState({});
    });
  }


  async saveLocation() {
    try {
      Geolocation.getCurrentPosition(
        position => {
          let pinPosition = `${position.coords.latitude}, ${position.coords.longitude}`;
          console.log('Matthias', this.state.pinName, pinPosition);
          let data = JSON.stringify({
            userName: 'Matthias',
            locationName: this.state.pinName,
            location: pinPosition,
          })
          this.server.fetchData("location", 'POST', data, true).then((response: any) => {
            console.log(response);
            this.setState({ overlayBool: false, pinName: '' });
            this.test();
          });
        },
        error => {
          console.log(error + 'error');
        },
        { enableHighAccuracy: true },
      );
    } catch (error) {
      console.log(error + 'error');
    }
  }

  deleteLocation() {
    try {
      let del = JSON.stringify({
        userName: "Matthias",
        locationName: "Coolplace"
      })
      this.server.fetchData("delete", "DELETE", del, true).then((response: any) => {
        console.log(response);
        this.setState({ deleteOverlay: false });
      })
    } catch (error) {
      console.log(error)
    }
  }

  render(): React.ReactNode {
    return (
      <>
        <View style={locationPinStyle.maincontainer}>
          <ImageBackground source={require('../assets/backgroundWavy.png')}>
            <View style={locationPinStyle.contentContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ overlayBool: true });
                }}
                style={locationPinStyle.addlocationbutton}>
                <Image
                  source={require('../assets/pluslocation.png')}
                  style={locationPinStyle.plusbutton as ImageStyle}></Image>
                <Text style={locationPinStyle.locationbuttontext}>
                  Pin current location
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={locationPinStyle.scrollview}>
              <View>{this.state.locationArray}</View>
            </ScrollView>
          </ImageBackground>
        </View>
        {this.state.overlayBool ? (
          <View style={cameraStyle.assignName}>
            <View style={cameraStyle.assignNameSubmitContainer}>
              <Text style={cameraStyle.assignNameText}>Location name:</Text>
              <TextInput
                onChangeText={e => {
                  this.setState({ pinName: e });
                }}
                value={this.state.pinName}
                style={cameraStyle.assignNameBox}></TextInput>
              <TouchableHighlight
                style={cameraStyle.notInUse}
                onPress={() => {
                  this.saveLocation();
                }}>
                <Text style={cameraStyle.assignNameSubmit}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        ) : null}
        {this.state.deleteOverlay ? (
          <View style={cameraStyle.assignName}>
            <View style={cameraStyle.assignNameSubmitContainer}>
              <Text style={cameraStyle.assignNameText}>
                Are you sure you want to delete this location?
              </Text>
              <View style={locationPinStyle.deleteCancelContainer}>
                <TouchableOpacity
                  onPress={() => this.setState({ deleteOverlay: false })}>
                  <Text style={locationPinStyle.deleteCancelButton}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deleteLocation()}>
                  <Text style={locationPinStyle.deleteButton}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  }
}
