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

// dependency
import RNFS from 'react-native-fs';
// import { MMKV } from 'react-native-mmkv'

// const storage = new MMKV()

// userStyle
import {homeStyle, mainStyle, userStyle} from '../styles/style';

export default class User extends Component<{navigation: any}> {
  state = {
    userName: '',
    password: '',
    connection: '10.3.208.95',
  };

  constructor(props: any) {
    super(props);
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
        {text: 'OK', onPress: () => console.log('OK Pressed')},
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
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  }

  async welcomeMessage() {
    Alert.alert(
      `Welcome to the BioLab app ${this.state.userName}.`,
      `You have now unlimited acces to the app.`,
      [{text: 'OK', onPress: () => this.props.navigation.navigate('Home', {})}],
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
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
    );
  }

  //   async saveUser() {
  //     // storage.set('user.name', `${this.state.userName}`);
  //     // const username = storage.getString('user.name');
  //     // console.log('Username:', username);
  //   }

  async createUser() {
    RNFetchBlob.fetch(
      'POST',
      `http://${this.state.connection}:8100/register`,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        userName: this.state.userName,
        password: this.state.password,
      }),
    ).then(res => {
      let status = res.info().status;
      if (status == 201) {
        console.log('Account created!');
        this.welcomeMessage();
      } else if (status == 500) {
        console.log('Fool, account already excists');
        this.duplicateUser();
      } else if (status == 400) {
        console.log("Fetch didn't work");
      }
    });
  }

  async login() {
    RNFetchBlob.fetch(
      'POST',
      `http://${this.state.connection}:8100/login`,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        userName: this.state.userName,
        password: this.state.password,
      }),
    ).then(res => {
      let status = res.info().status;
      if (status == 200) {
        console.log('You are logged in!');
        // this.saveUser();
        this.welcomeMessage();
      } else if (status == 500) {
        console.log('Fool, wrong password or username');
        this.wrongPassword();
      } else if (status == 501) {
        console.log("Account doesn't excist");
        this.falseUser();
      } else if (status == 400) {
        console.log("Fetch didn't work");
      }
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
                onChangeText={text => this.setState({userName: text})}
              />
            </View>
            <View style={userStyle.txtinput}>
              <TextInput
                placeholder="PASSWORD"
                secureTextEntry={true}
                onChangeText={text => this.setState({password: text})}
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
          </View>
        </ImageBackground>
      </View>
    );
  }
}
