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



  return (
    <View style={cameraStyle.body}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={cameraStyle.preview}
      >
      </RNCamera>

      <TouchableHighlight>
        <Text style={cameraStyle.capturebutton}>Analyze</Text>
      </TouchableHighlight>

    </View>
  );

}

