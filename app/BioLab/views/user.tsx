// react-native
import React, { Component, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';

// react-native
import { SafeAreaView, StyleSheet, Text, TextInput, TextInputProps, TouchableHighlight, View } from "react-native";

// dependency
import RNFS from 'react-native-fs';



// cameraStyle
import { mainStyle, cameraStyle } from '../styles/style';


export default class User extends Component<{ navigation: any }> {
    state = {
        username: '',
        password: ''
    }

    constructor(props: any) {
        super(props);
    }


    createUser = async () => {
        RNFetchBlob.fetch('POST', 'http://10.1.233.20:8100/register', { 'Content-Type': 'application/json' },
            JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        ).then((res) => {
            let status = res.info().status;
            console.log("status:", status);
            if (status == 200) {
                console.log("Account created!")
                let text = res.text()
                console.log(text)
                this.props.navigation.navigate('Home', {})
            } else if (status == 500) {
                console.log("Fool, account already excists");
            } else if (status == 400) {
                console.log("Fetch didn't work");
            }
        })
    }


    login = async () => {
        RNFetchBlob.fetch('POST', 'http://10.1.233.20:8100/login', { 'Content-Type': 'application/json' },
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
                this.props.navigation.navigate('Home', {})
            } else if (status == 500) {
                console.log("Fool, wrong password or username");
            } else if (status == 400) {
                console.log("Fetch didn't work");
            }
        })
    }

    render(): React.ReactNode {
        return (
            <View style={styles.container}>
                <TextInput style=
                    {{
                        borderColor: 'gray', borderWidth: 1, color: "blue"
                    }}
                    placeholder="Enter Username"
                    onChangeText={(text) => this.setState({ username: text })}
                />

                <TextInput style=
                    {{
                        borderColor: 'gray', borderWidth: 1, color: "blue"
                    }}
                    placeholder="Enter Password"
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                <TouchableHighlight onPress={() => this.login()}>
                    <Text>Login</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => this.createUser()}>
                    <Text>Register</Text>
                </TouchableHighlight>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtinput: {
        width: '75%',
        height: 50,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 24,
        margin: 10,

    }
});
