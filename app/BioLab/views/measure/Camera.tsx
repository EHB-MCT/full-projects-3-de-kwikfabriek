import React, {useEffect, useState} from 'react';

// react-native
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

// dependency
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';

// file managers
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

// cameraStyle
import {cameraStyle} from '../../styles/style';
import ImageColors from 'react-native-image-colors';
import ImagePicker from 'react-native-image-crop-picker';

export default function Camera() {
  let [shouldShow, setShouldShow] = useState(true);
  const [cameraShow, setCameraShow] = useState(true);
  const [{cameraRef}, {takePicture}] = useCamera(undefined);
  let [confirmationShow, setConfirmationShow] = useState(false);
  const [text, onChangeText] = useState(
    `${new Date().getFullYear()}${
      new Date().getMonth() + 1
    }${new Date().getDate()}_`,
  );
  const [nameInUse, setNameInUse] = useState(false);

  const captureHandle = async () => {
    try {
      let widthImg: any, heightImg: any;
      const data = await takePicture();
      await ImagePicker.openCropper({
        path: data.uri,
        width: data.width,
        height: data.height,
        mediaType: 'photo',
        cropperCircleOverlay: true,
        cropperRotateButtonsHidden: true,
        hideBottomControls: true,
      }).then(async image => {
        const result = await ImageColors.getColors(`${image.path}`, {});
        // HexToRgb source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        const hexToRgb = (hex: {
          replace: (
            arg0: RegExp,
            arg1: (m: any, r: any, g: any, b: any) => string,
          ) => {
            (): any;
            new (): any;
            substring: {
              (arg0: number): {
                (): any;
                new (): any;
                match: {(arg0: RegExp): any[]; new (): any};
              };
              new (): any;
            };
          };
        }) =>
          hex
            .replace(
              /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
              (m: any, r: string, g: string, b: string) =>
                '#' + r + r + g + g + b + b,
            )
            .substring(1)
            .match(/.{2}/g)
            .map((x: string) => parseInt(x, 16));

        console.log(hexToRgb(result.vibrant));

        let assignName = text;
        RNFS.moveFile(
          image.path,
          `${image.path.substring(
            0,
            image.path.lastIndexOf('/'),
          )}/${assignName}.jpg`,
        );
        console.log('succesfully saved image');
        setShouldShow(true);
        setConfirmationShow(true);
        setTimeout(() => setConfirmationShow(false), 3500);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {

  // });

  return (
    <View style={cameraStyle.body}>
      {cameraShow ? (
        <RNCamera
          ref={cameraRef}
          type={RNCamera.Constants.Type.back}
          style={cameraStyle.preview}
          flashMode={RNCamera.Constants.FlashMode.on}>
          <TouchableHighlight
            activeOpacity={0.5}
            onPress={() => captureHandle()}
            underlayColor="rgba(0,0,0,0)">
            <Image
              source={require('../../assets/FP3_image_capture.png')}
              style={cameraStyle.capturebutton}
            />
          </TouchableHighlight>
        </RNCamera>
      ) : null}
      {shouldShow ? (
        <View style={cameraStyle.assignName}>
          <View style={cameraStyle.assignNameSubmitContainer}>
            <Text style={cameraStyle.assignNameText}>Sample name:</Text>
            <TextInput
              style={cameraStyle.assignNameBox}
              onChangeText={text => {
                onChangeText(text);
                RNFetchBlob.fs
                  .ls(`${RNFS.ExternalDirectoryPath}/Pictures/`)
                  .then(files => {
                    if (files.indexOf(`${text}.jpg`) > -1) {
                      setNameInUse(true);
                    } else {
                      setNameInUse(false);
                    }
                  });
              }}
              value={text}
            />
            <TouchableHighlight
              style={
                (cameraStyle.assignNameSubmitHighlight,
                nameInUse ? cameraStyle.inUse : cameraStyle.notInUse)
              }
              onPress={() => {
                RNFetchBlob.fs
                  .ls(`${RNFS.ExternalDirectoryPath}/Pictures/`)
                  .then(files => {
                    if (files.indexOf(`${text}.jpg`) > -1) {
                      setNameInUse(true);
                      return setShouldShow(true);
                    } else {
                      setShouldShow(false);
                    }
                  });
              }}
              underlayColor="rgba(50,50,100,1)">
              <Text style={cameraStyle.assignNameSubmit}>Submit</Text>
            </TouchableHighlight>
          </View>
        </View>
      ) : null}
      {confirmationShow ? (
        <View style={cameraStyle.imageSavedCont}>
          <Text style={cameraStyle.ImageSavedText}>
            Image saved succesfully
          </Text>
        </View>
      ) : null}
    </View>
  );
}
