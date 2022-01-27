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
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {dataStyle} from '../styles/style';

export default class Data extends Component<
  {},
  {
    files: String[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      files: [],
    };

    RNFetchBlob.fs.ls(`${RNFS.ExternalDirectoryPath}/Pictures/`).then(files => {
      let tempFiles: String[] = [];
      files.forEach(e => {
        RNFetchBlob.fs
          .readFile(`${RNFS.ExternalDirectoryPath}/Pictures/${e}`, 'base64')
          .then(data => {
            tempFiles.push(`data:image/png;base64,${data}`);
          });
        this.setState({
          files: tempFiles,
        });
      });
    });
  }

  imageItem(data: any) {
    return (
      <View style={dataStyle.imageContainer}>
        {/* <Image source={{uri: data}} style={{height: 50, width: 50}} /> */}
        <Text>{data}</Text>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={dataStyle.dataContainer}>
        {
          (console.log(this.state.files.length),
          this.state.files.map(file => {
            return this.imageItem(file);
          }))
        }
      </ScrollView>
    );
  }
}

// voorlopige stijlen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
  },
});
