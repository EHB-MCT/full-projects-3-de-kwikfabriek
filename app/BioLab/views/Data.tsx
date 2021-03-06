import React, { Component, useEffect, useState } from 'react';
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
  ImageBackground,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { template } from '@babel/core';

// userStyle
import { mainStyle, dataStyle, userStyle } from '../styles/style';
import { thisExpression } from '@babel/types';
import Server from '../functions/Server';

export default class Data extends Component<
  { route: any; navigation: any },
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
      password: '1234',
      sampleID: [],
      id: [],
      RGB_values: [],
      timestamp: [],
      userName: 'Sam',
      dataContainer: [] as any,
      images: [],
      imageViews: [],
    };
    this.getData();
  }

  async getData() {
    this.server.fetchData("data","get", this.state.userName, true).then(
      (response: any) => {
        let newRes = JSON.parse(response);
        console.log(newRes);
        for (var data in newRes) {
          console.log(newRes[data]);
          // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
          this.setState(prevState => ({
            id: [...prevState.id, newRes[data].count],
            sampleID: [...prevState.sampleID, newRes[data].count],
            RGB_values: [...prevState.RGB_values, newRes[data].count],
            timestamp: [...prevState.timestamp, newRes[data].count],
          }));
          this.addData();
        }
      },
      res => {
        console.log('Could not retrieve data');
        console.log(res);
      },
    );
  }

  addData() {
    this.setState({
      dataContainer: [],
    });
    for (let a = 0; a < this.state.id.length; a++) {
      this.state.dataContainer.push(
        <View
          style={
            (dataStyle.dataContainer,
              { backgroundColor: `rgb(${this.state.RGB_values[a]})` })
          }
          key={a}>
          <Text style={dataStyle.dataSampleID}>{this.state.sampleID[a]}</Text>
          <Text style={dataStyle.timestamp}>{this.state.timestamp[a]}</Text>
          <Text style={dataStyle.rgbText}>{this.state.RGB_values[a]}</Text>
          {this.state.imageViews}
        </View>,
      );
    }
    this.setState({});
  }

  deleteUser() {
    console.log('Credentials:', this.state.userName, this.state.password);
    this.server.fetchData('delete', 'DELETE', 'Sam', true).then(
      (response: any) => { },
      res => {
        console.log('Could not retrieve data');
        console.log(res);
      },
    );
  }

  render() {
    return (
      <ScrollView style={dataStyle.container}>
        <ImageBackground
          imageStyle={{ opacity: 0.6 }}
          source={require('../assets/backgroundWavy.png')}>
          <View style={dataStyle.titleContainer}>
            <Text style={dataStyle.titleText}>Your samples:</Text>
          </View>
          <View style={dataStyle.dataBody}>{this.state.dataContainer}</View>
        </ImageBackground>
      </ScrollView>
    );
  }
}
