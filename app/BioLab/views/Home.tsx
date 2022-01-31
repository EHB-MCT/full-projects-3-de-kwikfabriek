import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
  FlatList,
  Switch,
  NativeModules,
  NativeEventEmitter,
  Image,
  ImageBackground,
} from 'react-native';
import RNFS from 'react-native-fs';
import { LinearGradient } from 'react-native-linear-gradient';
// import { SvgXml, SvgUri } from "react-native-svg"

const svgThing = require("../assets/Logo_waterdruppel.svg");

// homeStyle
import { mainStyle, homeStyle } from '../styles/style';




export default class Home extends Component<{ navigation: any }> {
  constructor(props: any) {
    super(props);
  }

  render(): React.ReactNode {
    return (

      <View style={homeStyle.container}>
        <ImageBackground style={homeStyle.backgroundGradient}
          source={require("../assets/gradient.png")}>


          <Text style={{ opacity: 0 }}></Text>

          <View>
            <View style={homeStyle.hamburgercontainer}>
              <TouchableHighlight onPress={() =>
                this.props.navigation.navigate('User', {})
              } underlayColor="rgba(0,0,0,0)">

                <Image style={homeStyle.hamburgerbutton} source={require('../assets/Hamburger.png')} />

              </TouchableHighlight>

            </View>
          </View>

          <View style={homeStyle.logocontainer}>
            <TouchableHighlight onPress={() =>
              this.props.navigation.navigate('Measure', {})
            } underlayColor="rgba(0,0,0,0)">

              <Image style={homeStyle.logo} source={require('../assets/Logo_waterdruppel.png')} />

            </TouchableHighlight>
          </View>

          <View style={homeStyle.menuContainer}>
            {/* Hier komt de body van de pagina */}

            {/* <View style={styles.row}>
            <Text style={styles.subTitle}>Measure with</Text>
          </View> */}

            <View style={homeStyle.row}>

              <TouchableHighlight onPress={() =>
                this.props.navigation.navigate('InfoView', {})
              } underlayColor="rgba(0,0,0,0)">

                <Image style={homeStyle.logobuttons} source={require('../assets/Info.png')} />

              </TouchableHighlight>



              <TouchableHighlight onPress={() =>
                this.props.navigation.navigate('Data', {})
              } underlayColor="rgba(0,0,0,0)">

                <Image style={homeStyle.logobuttons} source={require('../assets/Data.png')} />

              </TouchableHighlight>

              {/* info, camera, data, kaart */}
            </View>

            <View style={homeStyle.bottomMiddleButt}>
              <TouchableHighlight onPress={() =>
                this.props.navigation.navigate('Map', {})
              } underlayColor="rgba(0,0,0,0)">

                <Image style={homeStyle.logobuttons} source={require('../assets/Map.png')} />

              </TouchableHighlight>
            </View>




          </View>
          {/* </LinearGradient> */}
        </ImageBackground>
      </View>
    );
  }
}

(async function checkFolderExists() {
  if (await RNFS.exists(`${RNFS.ExternalDirectoryPath}/Pictures`)) {
  } else {
    console.log('folder created');
    RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/Pictures`);
  }
})();
