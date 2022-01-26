import React, {Component} from 'react';
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
import {LinearGradient} from 'react-native-linear-gradient';
// import { SvgXml, SvgUri } from "react-native-svg"

const svgThing = require('../assets/Logo_waterdruppel.svg');

export default class Home extends Component<{navigation: any}> {
  constructor(props: any) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.backgroundGradient}
          source={require('../assets/gradient.png')}>
          {/* <LinearGradient colors={['#7F7FD5', '#86A8E7', '#91eae4']}> */}

          <Text style={{opacity: 0}}></Text>

          <View style={styles.toolbar}>
            {/* Hier kunnen er knoppen komen */}
          </View>

          <View style={styles.logocontainer}>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('Measure', {})}
              underlayColor="rgba(0,0,0,0)">
              <Image
                style={styles.logo}
                source={require('../assets/Logo_waterdruppel.png')}
              />
            </TouchableHighlight>
          </View>

          <View style={styles.menuContainer}>
            {/* Hier komt de body van de pagina */}

            {/* <View style={styles.row}>
            <Text style={styles.subTitle}>Measure with</Text>
          </View> */}

            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('InfoView', {})}
                underlayColor="rgba(0,0,0,0)">
                <Image
                  style={styles.logobuttons}
                  source={require('../assets/Info-01.png')}
                />
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('Data', {})}
                underlayColor="rgba(0,0,0,0)">
                <Image
                  style={styles.logobuttons}
                  source={require('../assets/Data.png')}
                />
              </TouchableHighlight>

              {/* info, camera, data, kaart */}
            </View>

            <View style={styles.bottomMiddleButt}>
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('Map', {})}
                underlayColor="rgba(0,0,0,0)">
                <Image
                  style={styles.logobuttons}
                  source={require('../assets/Map.png')}
                />
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

// voorlopige stijlen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundGradient: {
    height: '100%',
    width: '100%',
  },
  menuContainer: {
    padding: 20,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 15,
    alignContent: 'center',
  },
  menuButtonText: {
    textAlign: 'center',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  toolbarButton: {
    width: 50,
  },
  subTitle: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    fontWeight: '600',
  },
  bottomMiddleButt: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    marginTop: -60,
  },
  logoSVG: {
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  logocontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logobuttons: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
  },
});
