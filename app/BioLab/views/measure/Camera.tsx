import React from 'react';

// react-native
import {Image, Text, TouchableHighlight, View} from 'react-native';

// dependency
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';

// cameraStyle
import {mainStyle, cameraStyle, deviceStyle} from '../../styles/style';
import ImageColors from 'react-native-image-colors';
import ImagePicker from 'react-native-image-crop-picker';

export default function Camera() {
  const [{cameraRef}, {takePicture}] = useCamera(undefined);

  const captureHandle = async () => {
    try {
      let widthImg: any, heightImg: any;
      const data = await takePicture();
      console.log(data.uri);

      // const filePath = data.uri;
      // const name = new Date()
      // const newFilePath = RNFS.ExternalDirectoryPath + `/file.jpg`;
      // await RNFS.moveFile(filePath, newFilePath)
      // .then(async () => {
      // console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
      console.log('Reading picture...');
      console.log(`${RNFS.ExternalDirectoryPath}/file.jpg`);

      await ImagePicker.openCropper({
        path: data.uri,
        width: data.width,
        height: data.height,
        mediaType: 'photo',
        cropperCircleOverlay: true,
        cropperRotateButtonsHidden: true,
        hideBottomControls: true,
      }).then(async image => {
        console.log(image);
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

        console.log(result);
        console.log(hexToRgb(result.average));
      });

      // })
      // .catch(error => {
      //   console.log(error);
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={cameraStyle.body}>
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
    </View>
  );
}
