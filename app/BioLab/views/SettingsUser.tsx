// react-native
import React, { Component, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';

// react-native
import { SafeAreaView, StyleSheet, Text, TextInput, TextInputProps, TouchableHighlight, View, Alert, Image, ImageBackground } from "react-native";

// dependency
import RNFS from 'react-native-fs';

// settingsStyle
import {mainStyle, settingsStyle, } from '../styles/style';


export default class SettingsUser extends Component<{ navigation: any }> {
    state = {
        username: '',
        password: ''
    }

    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <View style={settingsStyle.info}>

            </View >
        );
    }
}
