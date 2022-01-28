// react-native
import React, { Component, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';

// react-native
import { SafeAreaView, StyleSheet, Text, TextInput, TextInputProps, TouchableHighlight, View, Alert, Image, ImageBackground } from "react-native";

// dependency
import RNFS from 'react-native-fs';



// userStyle
import { homeStyle, mainStyle, userStyle } from '../styles/style';


export default class User extends Component<{ navigation: any }> {
    state = {
        username: '',
        password: ''
    }

    constructor(props: any) {
        super(props);
    }

    async duplicateUser() {
        Alert.alert(
            "Warning",
            `Account with username:${this.state.username} already excists!
            Use different username.`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }

    async wrongPassword() {
        Alert.alert(
            "Warning",
            `Wrong password, try again!`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }


    async welcomeMessage() {
        Alert.alert(
            `Welcome to the BioLab app ${this.state.username}.`,
            `You have now unlimited acces to the app.`,
            [
                { text: "OK", onPress: () => this.props.navigation.navigate('Home', {}) }
            ]
        );
    }

    async falseUser() {
        Alert.alert(
            `No account found with ${this.state.username}.`,
            `Try again with different name or create account.`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }




    async createUser() {
        RNFetchBlob.fetch('POST', 'http://10.3.208.87:8100/register', { 'Content-Type': 'application/json' },
            JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        ).then((res) => {
            let status = res.info().status;
            if (status == 200) {
                console.log("Account created!")
                let text = res.text()
                console.log(text)
                this.welcomeMessage();

            } else if (status == 500) {
                let text = res.text()
                console.log("Fool, account already excists");
                console.log(status)
                console.log(text)
                this.duplicateUser();
            } else if (status == 400) {
                console.log("Fetch didn't work");
                console.log(status)
                let text = res.text()
                console.log(text)
            }
        })
    }


    async login() {
        RNFetchBlob.fetch('POST', 'http://10.3.208.87:8100/login', { 'Content-Type': 'application/json' },
            JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        ).then((res) => {
            let status = res.info().status;
            console.log("status:", status);
            if (status == 200) {
                console.log("You are logged in!")
                let text = res.text()
                console.log(text);
                this.welcomeMessage();
            } else if (status == 500) {
                let text = res.text()
                console.log("Fool, wrong password or username");
                this.wrongPassword();
                console.log(status)
                console.log(text)
            } else if (status == 501) {
                let text = res.text()
                console.log("Account doesn't excist");
                this.falseUser();
                console.log(status)
                console.log(text)
            }
            else if (status == 400) {
                console.log("Fetch didn't work");
                console.log(status)
                let text = res.text()
                console.log(text)
            }
        })
    }


    render(): React.ReactNode {
        return (
            <View style={userStyle.container}>
                <ImageBackground style={userStyle.backgroundGradient}
                    source={require("../assets/gradient.png")}>
                    <View>
                        <Image style={userStyle.logo} source={require('../assets/Logo_noText.png')} />
                    </View>

                    <View style={userStyle.textinput}>
                        <View style={userStyle.txtinput}>
                            <TextInput style={userStyle.placeholder}
                                placeholder="EMAIL"
                                onChangeText={(text) => this.setState({ username: text })}
                            />
                        </View>
                        <View style={userStyle.txtinput}>
                            <TextInput
                                placeholder="PASSWORD"
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({ password: text })}
                            />
                        </View>
                    </View>

                    <View style={userStyle.submitbuttons}>
                        <TouchableHighlight style={userStyle.loginbutton} onPress={() => this.login()}>
                            <Text style={userStyle.loginbuttontxt}>Login</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={userStyle.registerbutton} onPress={() => this.createUser()}>
                            <Text style={userStyle.registerbuttontxt} >Register</Text>
                        </TouchableHighlight>
                    </View>
                </ImageBackground>
            </View >
        );
    }
}
