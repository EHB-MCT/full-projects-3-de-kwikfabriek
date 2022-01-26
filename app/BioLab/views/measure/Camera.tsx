// react-native
import React, { useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';

// react-native
import { SafeAreaView, Text, TextInput, TextInputProps, TouchableHighlight, View } from "react-native";

// dependency
import { RNCamera } from "react-native-camera";
import { useCamera } from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';



// cameraStyle
import { mainStyle, cameraStyle } from '../../styles/style';

export default function Camera() {
  const [{ cameraRef }, { takePicture }] = useCamera(undefined);
  const [text, onChangeText] = React.useState("Create user")

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

  const createUser = async () => {
    let name = "Bob";
    let pass = "12365";
    RNFetchBlob.fetch('POST', 'http://10.1.233.20:8100/register', { 'Content-Type': 'application/json' },
      JSON.stringify({
        username: "Bob",
        password: "12365"
      })
    ).then((res) => {
      let status = res.info().status;
      console.log(status, "this is status");
      if (status == 200) {
        // the conversion is done in native code
        let base64Str = res.base64()
        // the following conversions are done in js, it's SYNC
        let text = res.text()
        let json = res.json()
      } else {
        console.log("Fetch didn't work");
        // handle other status codes
      }
    })
  }


  const login = async () => {
    let name = "Bob";
    let pass = "12365";
    RNFetchBlob.fetch('POST', 'http://10.1.233.20:8100/login', { 'Content-Type': 'application/json' },
      JSON.stringify({
        username: "Bob",
        password: "12365"
      })
    ).then((res) => {
      let status = res.info().status;
      console.log("status:", status);
      if (status == 200) {
        console.log("You are logged in!")
        let text = res.text()
        console.log(text);
      } else if (status == 500) {
        console.log("Fool, wrong password or username");
      } else if (status == 400) {
        console.log("Fetch didn't work");
      }
    })
  }



  return (
    <View style={cameraStyle.body}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={cameraStyle.preview}
      >
      </RNCamera>

      {/* <TouchableHighlight onPress={() => captureHandle()}>
        <Text style={cameraStyle.capturebutton}>Analyze</Text>
      </TouchableHighlight> */}


      {/* <TouchableHighlight onPress={() => onGet()}>
        <Text style={cameraStyle.capturebutton}>Get users</Text>
      </TouchableHighlight>


      <TouchableHighlight onPress={() => onSend()}>
        <Text style={cameraStyle.capturebutton}>Send</Text>
      </TouchableHighlight> */}


      <TouchableHighlight onPress={() => createUser()}>
        <Text style={cameraStyle.capturebutton}>Create user</Text>
      </TouchableHighlight>


      <TouchableHighlight onPress={() => login()}>
        <Text style={cameraStyle.capturebutton}>Login</Text>
      </TouchableHighlight>





    </View>
  );

}

