import React, {Component} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {cameraStyle, locationPinStyle} from '../styles/style';

//Get location
import Geolocation from 'react-native-geolocation-service';

//Store location
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

export default class LocationPin extends Component<
  {navigation: any},
  {
    overlayBool: Boolean;
    pinName: string;
    locationArray: any[];
    deleteOverlay: Boolean;
    deleteName: String;
  }
> {
  constructor(props: any) {
    super(props);
    this.test();
    this.state = {
      overlayBool: false,
      pinName: '',
      locationArray: [],
      deleteOverlay: false,
      deleteName: '',
    };
  }
  test() {
    RNFetchBlob.fetch('GET', 'http://10.3.208.95:8100/location/Matthias', {
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
            <Text>{el.locationName}</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({deleteName: el.locationName});
                this.setState({deleteOverlay: true});
              }}>
              <Image source={require('../assets/deleteLocation.png')} />
            </TouchableOpacity>
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
          RNFetchBlob.fetch(
            'POST',
            'http://10.3.208.95:8100/location',
            {'Content-Type': 'application/json'},
            JSON.stringify({
              userName: 'Matthias',
              locationName: this.state.pinName,
              location: pinPosition,
            }),
          ).then(e => {
            console.log(e);
            this.setState({overlayBool: false, pinName: ''});
            this.test();
          });
        },
        error => {
          console.log(error + 'errorrrr');
        },
        {enableHighAccuracy: true},
      );
    } catch (e) {
      console.log(e + 'azkdah');
    }
  }

  deleteLocation() {
    try {
      let testingsomething = {
        userName: 'Matthias',
        locationName: this.state.deleteName,
      };
      const params: RequestInit = {
        method: 'DELETE',
        body: JSON.stringify(testingsomething),
      };
      console.log(testingsomething);
      fetch('http://10.3.208.95:8100/location/delete', params).then(e => {
        console.log(e);
        this.setState({deleteOverlay: false});
      });
      // RNFetchBlob.fetch(
      //   'DELETE',
      //   'http://10.3.208.95:8100/location/delete',
      //   {'Content-Type': 'application/json'},
      //   JSON.stringify({
      //     userName: 'Matthias',
      //     locationName: this.state.deleteName,
      //   }),
      // ).then(e => {
      //   console.log('Matthias', this.state.deleteName);
      //   console.log(e);
      //   this.setState({deleteOverlay: false});
      // });
    } catch (err) {
      console.log(err);
    }
  }

  render(): React.ReactNode {
    return (
      <>
        <View style={locationPinStyle.maincontainer}>
          <View style={locationPinStyle.contentcontainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({overlayBool: true});
              }}
              style={locationPinStyle.addlocationbutton}>
              <Image
                style={locationPinStyle.plusbutton}
                source={require('../assets/pluslocation.png')}></Image>
              <Text style={locationPinStyle.locationbuttontext}>
                Pin current location
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View>{this.state.locationArray}</View>
          </ScrollView>
        </View>
        {this.state.overlayBool ? (
          <View style={cameraStyle.assignName}>
            <View style={cameraStyle.assignNameSubmitContainer}>
              <Text style={cameraStyle.assignNameText}>Location name:</Text>
              <TextInput
                onChangeText={e => {
                  this.setState({pinName: e});
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
                  onPress={() => this.setState({deleteOverlay: false})}>
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
