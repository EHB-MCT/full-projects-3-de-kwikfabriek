import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Switch, NativeModules, NativeEventEmitter, ImageBackground, Image, TextInput, TouchableHighlight, } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';



// userStyle
import { mainStyle, dataStyle, userStyle } from '../styles/style';

export default class Data extends Component {
  state = {
    username: '',
    password: '',
    sampleID: '',
    link: ''
  }

  constructor(props: any) {
    super(props);
  }


  async sendData() {
    RNFetchBlob.fetch('POST', 'http://10.3.208.87:8100/data', { 'Content-Type': 'application/json' },
      JSON.stringify({
        sampleID: "20222701",
        link: "../assets/Logo_waterdruppel.png"
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
    RNFetchBlob.fetch('GET', 'http://10.3.208.87:8100/data', { 'Content-Type': 'application/json' },
      JSON.stringify({
        sampleID: "20222701",
      })
    ).then((res) => {
      let status = res.info().status;
      console.log("status:", res);
      if (status == 200) {
        let text = res.text()
        console.log(text);
        console.log("this is data");
        this.render();
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

            </View>
          </View >
        </View>
      </View>

    );
  }
}

