/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './views/Home';
import Camera from './views/measure/Camera';
import Measure from './views/measure';
import MapView from './views/MapView';
import Data from './views/Data';
import InfoView from './views/InfoView';
import DeviceList from './views/measure/DeviceList';
import User from './views/user';
import LocationPin from './views/LocationPin';
import Server from './functions/Server';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  server: Server;

  constructor(props: any) {
    super(props);
    this.server = new Server('http://biolab.miguelbilliet.be/');
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Home', headerShown: false}}
          />

          <Stack.Screen
            name="InfoView"
            component={InfoView}
            options={{title: 'Info'}}
          />

          <Stack.Screen
            name="LocationPin"
            component={LocationPin}
            options={{ title: 'LocationPin' }}
            initialParams={{ server: this.server }}
          />

          <Stack.Screen
            name="Map"
            component={MapView}
            options={{title: 'Map'}}
          />

          <Stack.Screen
            name="Data"
            component={Data}
            options={{title: 'Data'}}
            initialParams={{server: this.server}}
          />

          <Stack.Screen
            name="Measure"
            component={Measure}
            options={{title: 'Measure'}}
          />

          <Stack.Screen
            name="Device"
            component={DeviceList}
            options={{title: 'Incubators'}}
          />

          <Stack.Screen
            name="Camera"
            component={Camera}
            options={{ title: 'Camera' }}
            initialParams={{ server: this.server }}
          />

          <Stack.Screen
            name="User"
            component={User}
            options={{title: 'User'}}
            initialParams={{server: this.server}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
