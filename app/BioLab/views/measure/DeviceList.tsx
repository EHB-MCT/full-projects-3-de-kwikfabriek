// react
import React, { Component, useState, useEffect } from 'react';

// react native
import { PermissionsAndroid, LogBox, Animated } from 'react-native';
import { Text, View, ScrollView, Pressable } from 'react-native';

// dependency
import { BleManager, Device, NativeDevice } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

// deviceStyle
import { mainStyle, deviceStyle } from '../../styles/style';

// andere
import {formatNumber} from '../../functions/formatNumber';


// verberg warning logs in console
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();


const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

const SENSOR_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';

interface RGB {
  r: number,
  g: number,
  b: number,
  c: number // clear
}


export default class DeviceList extends Component<{ navigation: any }, {
  devices: Device[], 
  deviceNames: String[],
  connectedDevice: Device | null,
  scanning: Boolean,
  connected: Boolean,
  error: String | null,
  data: RGB | null,
  sensorDataArray: RGB[],
  status: Number,
  currentColor: string,
}> {

  manager: BleManager;

  constructor(props: any){
    super(props);

    this.manager = new BleManager();

    this.state = {
      devices: [],
      deviceNames: [],
      connectedDevice: null,
      scanning: false,
      connected: false,
      error: null,
      data: {r: 0, g: 0, b: 0, c: 0},
      sensorDataArray: [],
      status: 1,
      currentColor: "rgb(0, 0, 0)",
    }

    this.scanDevices();
  }

  /**
   * Start met scannen van bluetooth apparaten
   */
  scanDevices(){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(answer => {
      console.log('scanning');

      this.setState({
        devices: [],
        deviceNames: [],
        scanning: true
      })

      // ...

      this.manager.startDeviceScan(null, null, (error, scannedDevice) => {

        if (error) {
          console.warn(error);
        }

        if(scannedDevice && scannedDevice.name && !this.state.deviceNames.includes(scannedDevice.name)){ // voorkom duplicaties
          console.log('device found:', scannedDevice.name);
          
          let devices: Device[] = this.state.devices;
          let deviceNames: String[] = this.state.deviceNames;

          devices.push(scannedDevice);
          deviceNames.push(scannedDevice.name);

          this.setState({
            devices: devices,
            deviceNames: deviceNames
          })
          
        }

        if (scannedDevice && scannedDevice.name == 'INCUBATOR') {

          //this.manager.stopDeviceScan();
          //connectDevice(scannedDevice);
        }
      });

      // stop scanning devices after 5 seconds
      setTimeout(() => {
        this.stopScan();
      }, 10000);

    });

  }

  /**
   * Stop met scannnen van bluetooth apparaten
   */
  stopScan(){
    this.setState({
      scanning: false
    })

    this.manager.stopDeviceScan();
    console.log('stoped with scanning');
  }

  /**
   * Connecteren met het bluetooth apparaat
   * @param device 
   */
  connect(device: Device){
    this.manager.stopDeviceScan();
    
    device
      .connect()
      .then(device => {
        // setConnectedDevice(device);
        // setIsConnected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {

        console.log(`Connected with ${device.name}`);

        this.setState({
          connected: true,
          connectedDevice: device
        });

        this.manager.onDeviceDisconnected(device.id, () => {
          device ? console.log(`${device.name} disconnected`) : console.log('device disconnected');
          this.setState({
            connected: false,
            connectedDevice: null
          });
          this.scanDevices();
        });

        // ...

        // device.readCharacteristicForService(SERVICE_UUID, SENSOR_UUID).then(value => {
        //   this.setState({
        //     data: base64.decode(value.value ?? "")
        //   });
        // });

        device.monitorCharacteristicForService(SERVICE_UUID, SENSOR_UUID, (error, characteristic) => {
            if (characteristic?.value != null) {

              let value: string = base64.decode(characteristic?.value ?? null);

              switch(value){
                case 'BEGIN':
                  this.setState({
                    sensorDataArray: []
                  });
                  break;
                case 'END':

                  this.setState({
                    status: 3
                  })

                  let sum: number = 0;

                  let avgR: number;
                  let avgG: number;
                  let avgB: number;
                  let avgC: number;

                  let fixR: number;
                  let fixG: number;
                  let fixB: number;

                  let arrR: number[] = [];
                  let arrG: number[] = [];
                  let arrB: number[] = [];
                  let arrC: number[] = [];

                  for (let index = 0; index < this.state.sensorDataArray.length; index++) {
                    arrR.push(this.state.sensorDataArray[index].r);
                    arrG.push(this.state.sensorDataArray[index].g);
                    arrB.push(this.state.sensorDataArray[index].b);
                    arrC.push(this.state.sensorDataArray[index].c);
                  }

                  sum = arrR.reduce((a, b) => a + b, 0);
                  avgR = (sum / arrR.length) || 0;

                  sum = arrG.reduce((a, b) => a + b, 0);
                  avgG = (sum / arrG.length) || 0;

                  sum = arrB.reduce((a, b) => a + b, 0);
                  avgB = (sum / arrB.length) || 0;

                  sum = arrC.reduce((a, b) => a + b, 0);
                  avgC = (sum / arrC.length) || 0;

                  

                  const maxRGB = 25000;
                  const minRGB = 0;
                  const calcRGB = maxRGB - minRGB;

                  fixR = (avgR / calcRGB) * 255;
                  fixG = (avgG / calcRGB) * 255;
                  fixB = (avgB / calcRGB) * 255;

                  let test: number = fixB - ((fixG + fixR));

                  // saturatie berekenen


                  this.setState({
                    data: {
                      r: fixR,
                      g: fixG,
                      b: fixB,
                      c: avgC
                    },
                    currentColor: `rgb(${fixR},${fixG},${fixB})`,
                    status: 4
                  });

                  // console.log(`${avgR}\t${avgG}\t${avgB}\t${avgC}`);
                  console.log(`${test}`);
                  
                  break;
                default:
                  if(value && value !== "BAD"){

                    let stateSensorData: RGB[]  = this.state.sensorDataArray;

                    let splittedValue = value.split(',');

                    let currentValue: RGB = {
                      r: Number(splittedValue[0]),
                      g: Number(splittedValue[1]),
                      b: Number(splittedValue[2]),
                      c: Number(splittedValue[3]),
                    }

                    stateSensorData.push(currentValue);
                    this.setState({
                      sensorDataArray: stateSensorData
                    })
                  }
                  break;
              }

            }
        },
          'messagetransaction',
        );


      });


  }

  /**
   * data versturen naar verbonden apparaat
   * @param data data om te versturen
   * @param characteristicUUID characteristic UUID
   */
  sendData(data: string, characteristicUUID: string){
    if(this.state.connectedDevice?.id){
      this.manager.writeCharacteristicWithResponseForDevice(this.state.connectedDevice?.id, SERVICE_UUID, characteristicUUID, 
        base64.encode(data)).then(characteristic => {
          //console.log(`data sended: ${base64.decode(characteristic.value ?? "Undefined")}`);
        });
    }
  }

  /**
   * Ontkoppelen met het bluetoothapparaat
   */
  async disconnect(){
    if(this.state.connectedDevice){
      if(await this.state.connectedDevice.isConnected()){
        this.manager.cancelTransaction('messagetransaction');
        this.manager.cancelTransaction('nightmodetransaction');

        this.manager.cancelDeviceConnection(this.state.connectedDevice.id).then(() => {
          console.log('disconnected');
        });
      }

      if(! await this.state.connectedDevice.isConnected){
        this.setState({
          connected: false,
          connectedDevice: null
        });
      }
    }
  }

  componentWillUnmount(){
    if(this.state.scanning) this.stopScan();
    if(this.state.connectedDevice) this.disconnect();
  }


  /**
   * Start measurement
   */
  measure(){
    this.setState({
      status: 2
    });
    this.sendData('status 2', SENSOR_UUID);
  }

  /**
   * start calibration
   */
  calibrate(){

    let calibrate = false;

    while(!calibrate){

      



    }

    this.setState({
      status: 5
    });
    this.sendData('status 5', SENSOR_UUID);

  }




  statusToString(status: Number){
    switch(status){
      case 0:
        return "Making connection";
        break;
      case 1:
        return "Connected";
        break;
      case 2:
        return "Measuring";
        break;
      case 3:
        return "Processing";
        break;
      case 4:
        return "Ready";
        break;
      case 5:
        return "Calibrating";
        break;
      default:
        return `Error (${status})`;
        break;
    }
  }


  /**
   * 
   * @param device bluetooth apparaat object
   * @returns JSX - Apparaatknop
   */
  renderDevices(device: Device){
    return (
      <Pressable style={device.name == "INCUBATOR" ? (deviceStyle.deviceContainer) : (deviceStyle.deviceContainerOther)} key={ device.id }
        onPress={() => this.connect(device)}>
        <Text style={deviceStyle.deviceText}>{ device.name }</Text>
        <Text style={deviceStyle.deviceSubText}>{ device.id }</Text>
      </Pressable>
    )
  }

  renderDeviceList(){
    return (
      <View>
        <ScrollView>
          {
            this.state.devices.map((device) => {
              return this.renderDevices(device);
            })
          }
        </ScrollView>
        {!this.state.scanning ? (
          <Pressable
            style={deviceStyle.button}
            onPress={() => {
              this.scanDevices();
            }}
          >
            <Text style={deviceStyle.buttonText}>Scan for devices</Text>
          </Pressable>
        ) : (
          <Pressable
            style={deviceStyle.buttonRed}
            onPress={() => {
              // ...
            }}
          >
            <Text style={deviceStyle.buttonText}>Scanning...</Text>
          </Pressable>
        )}
      </View>
    )
  }

  renderIncubator(){
    return (
      <View>
        <Pressable 
          style={deviceStyle.buttonRed}
          onPress={() => {this.disconnect()}}
        >
          <Text style={deviceStyle.buttonText}>Disconnect</Text>
        </Pressable>
        <View style={[mainStyle.center, mainStyle.bottom]}>

          <Text style={deviceStyle.statusText}>{ this.statusToString(this.state.status) }</Text>
          <Text style={deviceStyle.statusText}>Value: { this.state.currentColor }</Text>
          <Animated.View 
      		style={[deviceStyle.box, {backgroundColor: this.state.currentColor}]}
      	  />

          <Pressable
            style={deviceStyle.button}
            onPress={()=> {this.measure()}}
          >
            <Text style={deviceStyle.buttonText}>Measure sample</Text>
          </Pressable>

          <Pressable
            style={deviceStyle.button}
            onPress={()=> {this.calibrate()}}
          >
            <Text style={deviceStyle.buttonText}>Calibrate</Text>
          </Pressable>
          
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={mainStyle.container}>

        {this.state.connected
          ? this.renderIncubator()
          : this.renderDeviceList()
        }

      </View>
    )
  }

}