import React, {Component, useEffect, useState} from 'react';
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
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { template } from '@babel/core';

// userStyle
import { mainStyle, dataStyle, userStyle } from '../styles/style';
import { thisExpression } from '@babel/types';
import Server from '../functions/Server';



export default class Data extends Component<{ route: any, navigation: any },
  {
    id: Number[];
    sampleID: String[];
    RGB_values: String[];
    timestamp: String[];
    userName: String;
    password: String;
    dataContainer: any[];
    images: String[];
    imageViews: any[];
  }
> {

  tempFiles = [];
  server: Server;
  constructor(props: any) {
    super(props);

    this.server = this.props.route.params.server;
    this.state = {
      locationName: "",
      password: "",
      files: [],
      sampleID: [],
      link: require('../assets/Logo_noText.png'),
      connection: '10.3.208.131',
      id: [],
      RGB_values: [],
      timestamp: [],
      userName: "",
      dataContainer: [] as any,
      images: [],
      imageViews: [],
    };
    // this.getData();
  }


  async getData() {
    console.log("Getting data..");
    this.server.fetchData("data", "Sam").then((response: any) => {
      console.log("response:", response);
    }, (res) => {
      console.log(res);
      let newRes = JSON.parse(res.text());
      for (let count in newRes) {
        console.log(newRes[count]);
        // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
        this.setState(prevState => ({
          id: [...prevState.id, newRes[count].id],
          sampleID: [...prevState.sampleID, newRes[count].sampleID],
          RGB_values: [...prevState.RGB_values, newRes[count].RGB_values],
          timestamp: [...prevState.timestamp, newRes[count].timestamp],
        }));

        // sampleID: newRes[count].sampleID,
        // RGB_values: newRes[count].RGB_values,
        // timestamp: newRes[count].timestamp,
        // userName: loggedInUser,
      }
      this.addData();
    });
  }

  addData() {
    this.setState({
      dataContainer: [],
    });
    for (let a = 0; a < this.state.id.length; a++) {
      this.state.dataContainer.push(
        <View style={dataStyle.dataContainer} key={a}>
          <Text>{this.state.sampleID[a]}</Text>
          <Text>{this.state.RGB_values[a]}</Text>
          <Text>{this.state.timestamp[a]}</Text>
          {this.state.imageViews}
        </View>,
      );
    }
    this.setState({});
  }

  deleteUser() {
    console.log("deleting...")
    console.log("Credentials:", this.state.userName, this.state.password);
    fetch(`http://${this.state.connection}:8100/location/delete`,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: this.state.userName,
          locationName: this.state.locationName,
        })
      }
    ).then(res => {
      console.log("Response:", res);
    });
  }

  render() {
    return (
      <ScrollView style={mainStyle.container}>
        <View>
          <Text>Your samples:</Text>
        </View>
        <View>{this.state.dataContainer}</View>
        <View>
          <TouchableHighlight style={userStyle.registerbutton} onPress={() => this.getData()}>
            <Text style={userStyle.registerbuttontxt} >Delete</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>

    );
  }
}
