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
import {template} from '@babel/core';

// userStyle
import {mainStyle, dataStyle, userStyle} from '../styles/style';
import {thisExpression} from '@babel/types';

const loggedInUser = 'Matthias';

export default class Data extends Component<
  {navigation: any},
  {
    id: Number[];
    sampleID: String[];
    RGB_values: String[];
    timestamp: String[];
    userName: String;
    dataContainer: any[];
    images: String[];
    imageViews: any[];
  }
> {
  tempFiles = [];

  constructor(props: any) {
    super(props);

    this.state = {
      id: [],
      sampleID: [],
      RGB_values: [],
      timestamp: [],
      userName: loggedInUser,
      dataContainer: [] as any,
      images: [],
      imageViews: [],
    };

    // RNFetchBlob.fs.ls(`${RNFS.ExternalDirectoryPath}/Pictures/`).then(files => {
    //   let tempFiles: String[] = [];
    //   files.forEach(e => {
    //     console.log(e);
    //     RNFetchBlob.fs
    //       .readFile(`${RNFS.ExternalDirectoryPath}/Pictures/${e}`, 'base64')
    //       .then(data => {
    //         // let image = new Image();
    //         tempFiles.push(`data:image/jpg;base64,${data[0]}`);
    //         // console.log(data[0]);

    //         let something = (
    //           <View>
    //             <Image source={require(`data:image/png;base64,${data[0]}`)} />
    //           </View>
    //         );

    //         this.setState(prevState => ({
    //           imageViews: [...prevState.images, something],
    //         }));
    //       });
    //   });

    //   this.setState({
    //     images: tempFiles,
    //   });
    // });
    this.getData();
  }

  getData() {
    RNFetchBlob.fetch('GET', `http://10.3.208.131:8100/data/${loggedInUser}`, {
      'Content-Type': 'application/json',
    }).then(res => {
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
    // console.log(typeof res.data);
    // for (const sample of res.data) {
    //   console.log(sample.id);
    // }
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

  render() {
    return (
      <ScrollView style={mainStyle.container}>
        <View>
          <Text>Your samples:</Text>
        </View>
        <View>{this.state.dataContainer}</View>
      </ScrollView>
    );
  }
}
