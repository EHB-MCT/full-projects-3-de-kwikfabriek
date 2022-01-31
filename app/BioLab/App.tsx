/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  SafeAreaView,
  ScrollView,
  Settings,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Home from './views/Home';
import Camera from './views/measure/Camera';
import Measure from './views/measure';
import MapView from './views/MapView';
import Data from './views/Data';
import InfoView from './views/InfoView';
import DeviceList from './views/measure/DeviceList';
import User from './views/user';
import SettingsUser from './views/SettingsUser';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home', headerShown: false }}
          />

          <Stack.Screen
            name="InfoView"
            component={InfoView}
            options={{ title: 'Info' }}
          />

          <Stack.Screen
            name="Map"
            component={MapView}
            options={{ title: 'Map' }}
          />

          <Stack.Screen
            name="Data"
            component={Data}
            options={{ title: 'Data' }}
          />

          <Stack.Screen
            name="Measure"
            component={Measure}
            options={{ title: 'Measure' }}
          />

          <Stack.Screen
            name="Device"
            component={DeviceList}
            options={{ title: 'Incubators' }}
          />

          <Stack.Screen
            name="Camera"
            component={Camera}
            options={{ title: 'Camera' }}
          />

          <Stack.Screen
            name="User"
            component={User}
            options={{ title: 'User' }}
          />

          <Stack.Screen
            name="SettingsUser"
            component={SettingsUser}
            options={{ title: 'Settings' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  }
});
