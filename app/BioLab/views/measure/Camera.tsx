// react-native
import React from 'react';

// react-native
import { Alert, Text, TouchableHighlight, View } from "react-native";

// dependency
import { RNCamera } from "react-native-camera";
import { useCamera } from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';
import { prominent } from 'color.js';

// cameraStyle
import { mainStyle, cameraStyle } from '../../styles/style';

export default function Camera() {
  const [{ cameraRef }, { takePicture }] = useCamera(undefined);

  const captureHandle = async () => {
    try {
      const data = await takePicture();
      console.log(data.uri);
      const filePath = data.uri;
      // const name = new Date()
      const newFilePath = RNFS.ExternalDirectoryPath + `sample.jpg`;

      await RNFS.moveFile(filePath, newFilePath)
        .then(() => {
          console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
          console.log("Reading picture...")
          prominent('filessample.jpg').then((colors: any) =>
            console.log(colors));
        })
        .catch(error => {
          console.log(error);
        })
    } catch (error) {
      console.log(error);
    }
  }

  const onGet = async () => {
    try {
      await fetch('https://jsonplaceholder.typicode.com/todos/1')
        //Tijdelijke fetch link, andere werkt voorlopig niet of weet niet welke ik moet gebruiken
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data, "List with all users")
        });
    } catch (error) {
      console.log(error, "Fetch doesn't work")

    } finally {
      console.log("Retrieved all users from BioLab server")
    }
  }


  const onSend = async () => {
    await fetch('http://127.0.0.1:8100/test', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: "George",
        password: "1234"
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          var username = res.message;
          console.log("Login success");
        } else {
          console.log("invalid credentials")
        }
      })
  }


  // try {
  //   await fetch('http://127.0.0.1:8100/test', {
  //     //Tijdelijke fetch link, andere werkt voorlopig niet of weet niet welke ik moet gebruiken
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       username: 'George',
  //       password: '13546'
  //     })
  //   });
  // } catch (error) {
  //   console.log(error, "Fetch doesn't work")

  // } finally {
  //   console.log("Send data to BioLab server")
  // }

  return (
    <View style={cameraStyle.body}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={cameraStyle.preview}
      >
      </RNCamera>

      <TouchableHighlight onPress={() => captureHandle()}>
        <Text style={cameraStyle.capturebutton}>Analyze</Text>
      </TouchableHighlight>


      <TouchableHighlight onPress={() => onGet()}>
        <Text style={cameraStyle.capturebutton}>Get users</Text>
      </TouchableHighlight>


      <TouchableHighlight onPress={() => onSend()}>
        <Text style={cameraStyle.capturebutton}>Send</Text>
      </TouchableHighlight>


    </View>
  );


}

