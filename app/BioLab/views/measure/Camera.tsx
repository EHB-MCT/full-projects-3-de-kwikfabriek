// react-native
import React, { useState } from 'react';

// react-native
import { Image, ImageBackground, SafeAreaView, Text, TextInput, TextInputProps, TouchableHighlight, TouchableOpacity, View } from "react-native";

// dependency
import { RNCamera } from "react-native-camera";
import { useCamera } from 'react-native-camera-hooks';



// file managers
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

// cameraStyle
import { cameraStyle } from '../../styles/style';
import ImageColors from 'react-native-image-colors';
import ImagePicker from 'react-native-image-crop-picker';

export default function Camera() {
  let [shouldShow, setShouldShow] = useState(true);
  const [cameraShow, setCameraShow] = useState(true);
  const [{ cameraRef }, { takePicture }] = useCamera(undefined);
  let [confirmationShow, setConfirmationShow] = useState(false);
  const [text, onChangeText] = useState(
    `${new Date().getFullYear()}${new Date().getMonth() + 1
    }${new Date().getDate()}_`,
  );
  const [nameInUse, setNameInUse] = useState(false);
  let [rgbValues, setRgbValues] = useState();

  RNFetchBlob.fs.ls(`${RNFS.ExternalDirectoryPath}/Pictures/`).then(files => {
    if (files.indexOf(`${text}.jpg`) > -1) {
      setNameInUse(true);
    } else {
      setNameInUse(false);
    }
  });

  const captureHandle = async () => {
    try {
      let widthImg: any, heightImg: any;
      const data = await takePicture();
      await ImagePicker.openCropper({
        path: data.uri,
        width: data.width,
        height: data.height,
        mediaType: 'photo',
        cropperRotateButtonsHidden: true,
        hideBottomControls: true,
      }).then(async (image: { path: string; }) => {
        setCameraShow(false);
        // HexToRgb source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        const hexToRgb = (hex: {
          replace: (
            arg0: RegExp,
            arg1: (m: any, r: any, g: any, b: any) => string,
          ) => {
            (): any;
            new(): any;
            substring: {
              (arg0: number): {
                (): any;
                new(): any;
                match: { (arg0: RegExp): any[]; new(): any };
              };
              new(): any;
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

        const result = await ImageColors.getColors(`${image.path}`, {});
        setRgbValues(hexToRgb(result.dominant));
        console.log(result);
        console.log(hexToRgb(result.dominant));

        let assignName = text;
        RNFS.moveFile(
          image.path,
          `${image.path.substring(
            0,
            image.path.lastIndexOf('/'),
          )}/${assignName}.jpg`,
        );
        setShouldShow(true);
        setConfirmationShow(true);
      });
    } catch (error) {
      console.log(error, 'haha');
    }
  };

  async function deleteImage(imagePath: string) {
    await RNFS.unlink(imagePath);
    setCameraShow(true);
    setConfirmationShow(false);
  }

  return (
    <View style={cameraStyle.body}>
      {cameraShow ? (
        <RNCamera
          ref={cameraRef}
          type={RNCamera.Constants.Type.back}
          style={cameraStyle.preview}
          flashMode={RNCamera.Constants.FlashMode.torch}
          whiteBalance={RNCamera.Constants.WhiteBalance.auto}>
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
              onChangeText={async text => {
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
          <ImageBackground
            style={cameraStyle.backgroundSaved}
            source={require('../../assets/WavyBg_imageSaved.png')}>
            <View style={cameraStyle.logoSavedCont}>
              <Image
                source={require('../../assets/Analyze_backgroundLogo.png')}
                style={cameraStyle.logoSaved}
              />
              <Text style={cameraStyle.logoText}>Qty Hg:</Text>
              <Text style={cameraStyle.logoText}>2 nM Hg2+</Text>
              <Text style={cameraStyle.logoTextWater}>Color water</Text>
              <View style={cameraStyle.colorSaved}>
                <Text style={cameraStyle.rgbvalues}>
                  {rgbValues[0]}, {rgbValues[1]}, {rgbValues[2]}
                </Text>
              </View>
            </View>
            <Text style={cameraStyle.waterResultDesc}>
              Overall clear and healthy water. It’s not dangerous to drink from
              this water and it’s good for cooking.
            </Text>

            <View style={cameraStyle.imageSavedButtonsCont}>
              <TouchableOpacity
                style={cameraStyle.imageSavedButtons}
                onPress={async () => {
                  deleteImage(
                    `${RNFS.ExternalDirectoryPath}/Pictures/${text}.jpg`,
                  );
                }}>
                <Text style={cameraStyle.imageSavedButtonsText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={cameraStyle.imageSavedButtons}
                onPress={() => {
                  setCameraShow(true);
                  setConfirmationShow(false);
                }}>
                <Text style={cameraStyle.imageSavedButtonsText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      ) : null}
    </View>
  );
}
