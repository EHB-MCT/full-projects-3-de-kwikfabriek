// react-native
import React, { Component, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';

// react-native
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableHighlight,
  View,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';

import login from '../functions/Server';

// dependency
import RNFS from 'react-native-fs';

// userStyle
import { homeStyle, mainStyle, userStyle } from '../styles/style';

import Server from '../functions/Server';

export default class User extends Component<{ route: any, navigation: any }> {
  state = {
    userName: '',
    password: ''
  };

  server: Server;

  constructor(props: any) {
    super(props);
    this.server = this.props.route.params.server;

  }

  async duplicateUser() {
    Alert.alert(
      'Warning',
      `Account with username:${this.state.userName} already excists! Use different username.`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
    );
  }

  async wrongPassword() {
    Alert.alert('Warning', `Wrong password, try again!`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
  }

  async welcomeMessage() {
    Alert.alert(
      `Welcome to the BioLab app ${this.state.userName}.`,
      `You have now unlimited acces to the app.`,
      [{ text: 'OK', onPress: () => this.props.navigation.navigate('Home', {}) }],
    );
  }

  async falseUser() {
    Alert.alert(
      `No account found with ${this.state.userName}.`,
      `Try again with different name or create account.`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
    );
  }

  async createUser() {
    let user = {
      userName: "Bob",
      password: "1234",
    };

    this.server.register(user.userName, user.password).then((response: any) => {
      console.log(response)
      console.log('Account created!');
      this.welcomeMessage();
    }, (res) => {
      if (res == "Account") {
        console.log('Fool, account already excists');
        this.duplicateUser();
      } else if (res == "Error") {
        console.log("Fetch didn't work.")
      }
    })
  }


  async login() {
    console.log("Running loggin function.", this.state.userName, this.state.password);

    this.server.login(this.state.userName, this.state.password).then((response: any) => {
      console.log(response);
      console.log('You are logged in!');
      this.welcomeMessage();
    }, (res) => {
      if (res == "Password") {
        console.log('Fool, wrong password or username');
        this.wrongPassword();
      } else if (res == "Account") {
        console.log("Account doesn't excist");
        this.falseUser();
      } else if (res == "Error") {
        console.log("Fetch didn't work");
      }

    })
  }



  test(){

    /**
     * Eerste parameter is de route naar waar de request gestuurd word
     * 2de parameter is welke methode je gebruikt (GET, POST, DELETE of PUT)
     * 3de parameter is de data die je wilt doorsturen
     * 4de parameter is als de user ingelogd moet zijn, ook word de user data dan meegegeven.
     */

    this.server.fetchData('test', 'POST', {param1: 'hello', param2: 'world'}, true).then((response) => {
      // Alles in orde

      console.log(response);

    }).then((response) => {
      // error
      console.log(response);
    });
  }


  render(): React.ReactNode {
    return (
      <View style={userStyle.container}>
        <ImageBackground
          style={userStyle.backgroundGradient}
          source={require('../assets/gradient.png')}>
          <View>
            <Image
              style={userStyle.logo}
              source={require('../assets/Logo_noText.png')}
            />
          </View>

          <View style={userStyle.textinput}>
            <View style={userStyle.txtinput}>
              <TextInput
                style={userStyle.placeholder}
                placeholder="EMAIL"
                onChangeText={text => this.setState({ userName: text })}
              />
            </View>
            <View style={userStyle.txtinput}>
              <TextInput
                placeholder="PASSWORD"
                secureTextEntry={true}
                onChangeText={text => this.setState({ password: text })}
              />
            </View>
          </View>

          <View style={userStyle.submitbuttons}>
            <TouchableHighlight
              style={userStyle.loginbutton}
              onPress={() => this.login()}>
              <Text style={userStyle.loginbuttontxt}>Login</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={userStyle.registerbutton}
              onPress={() => this.createUser()}>
              <Text style={userStyle.registerbuttontxt}>Register</Text>
            </TouchableHighlight>



            <TouchableHighlight
              style={userStyle.registerbutton}
              onPress={() => this.test()}>
              <Text style={userStyle.registerbuttontxt}>Test</Text>
            </TouchableHighlight>




          </View>
        </ImageBackground>
      </View>
    );
  }
}
