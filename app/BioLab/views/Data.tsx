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
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { template } from '@babel/core';

// userStyle
import { mainStyle, dataStyle, userStyle } from '../styles/style';

export default class Data extends Component {
  state = {
    userName: '',
    password: '',
    sampleID: '',
    link: require('../assets/Logo_noText.png'),
    connection: '10.3.208.95',
  }

  constructor(props: any) {
    super(props);
    this.state = {
      files: [],
      sampleID: '20220201',
      link: require('../assets/Logo_noText.png')
    };

    RNFetchBlob.fs.ls(`${RNFS.ExternalDirectoryPath}/Pictures/`).then(files => {
      let tempFiles: String[] = [];
      files.forEach(e => {
        RNFetchBlob.fs
          .readFile(`${RNFS.ExternalDirectoryPath}/Pictures/${e}`, 'base64')
          .then(data => {
            tempFiles.push(`data:image/png;base64,${data}`);
          });
      });
      this.setState({
        files: tempFiles,
      });
      console.log(tempFiles);
    });
  }

  async sendData() {
    RNFetchBlob.fetch('POST', `http://${this.state.connection}:8100/data`, { 'Content-Type': 'application/json' },
      JSON.stringify({
        sampleID: "20222701",
        link: "Logo_waterdruppel.png"
      })
    ).then((res) => {
      let status = res.info().status;
      console.log("status:", status);
      if (status == 200) {
        let text = res.text()
        console.log(text);
        console.log(res)
      }
      else if (status == 400) {
        let text = res.text()
        console.log(text)
      }
    })
  }

  async getData() {
    return RNFetchBlob.fetch('GET', `http://10.3.208.95:8100/data/Sam`, { 'Content-Type': 'application/json' },
    ).then((res) => {
      let status = res.info().status;
      console.log("status:", res);
      console.log("filelink:", res.data.fileURL);
      if (status == 200) {
        let text = res.text()
        this.setState({ link: text })
        console.log("filelink:", res.data);
        // this.render();
      }
      else if (status == 400) {
        let text = res.text()
        console.log(text)
        console.log("no data recieved")
      }
    })
  }

  render() {

    return (
      <View style={mainStyle.container}>
        <View style={mainStyle.toolbar}>
          <View style={userStyle.container}>
            <View>
              <TouchableHighlight style={userStyle.loginbutton} onPress={() => this.sendData()}>
                <Text>Send data</Text>
              </TouchableHighlight>
              <TouchableHighlight style={userStyle.registerbutton} onPress={() => this.getData()}>
                <Text >Get data</Text>
              </TouchableHighlight>
              <View>
                <Image source={this.state.link} />
              </View>

            </View>
          </View >
        </View>
      </View>
    )
  }
}

