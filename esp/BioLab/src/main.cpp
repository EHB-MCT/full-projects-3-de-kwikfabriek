#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <sstream>

#include <functions.h>
#include <sensor.h>

// BLE
BLEServer *pServer = NULL;

BLECharacteristic *sensor_characteristic = NULL;
BLECharacteristic *status_characteristic = NULL;

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define SENSOR_CHARACTERISTIC_UUID "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"

// ESP/SENSOR
Sensor sensor(A0, 32);


/**
 * @brief server callbacks
 * 
 */
class MyServerCallbacks : public BLEServerCallbacks{
  void onConnect(BLEServer *pServer){
    Serial.println("Connected");
  };

  void onDisconnect(BLEServer *pServer){
    Serial.println("Disconnected");
  }
};

/**
 * @brief Characteristics callback
 * 
 */
class CharacteristicsCallbacks : public BLECharacteristicCallbacks{
  void onWrite(BLECharacteristic *pCharacteristic){

    string statusValue = pCharacteristic->getValue();

    vector<string> splittedStatusValue = split(statusValue, ' ');

    for (string item: splittedStatusValue){
      char char_array[item.length() + 1];
      strcpy(char_array, item.c_str());

      Serial.print("-> ");
      Serial.println(char_array);
    }

    if(splittedStatusValue[0] == "status"){

      if(splittedStatusValue[1] == "2"){ // measure

        sensor.enableLed();
        
        delay(2500);

        sensor_characteristic->setValue("BEGIN");
        sensor_characteristic->notify();

        for (size_t i = 0; i < 20; i++)
        {

          string sensorData = sensor.sensorData();

          sensor_characteristic->setValue(sensorData);
          sensor_characteristic->notify();

          delay(50);
        }

        sensor_characteristic->setValue("END");
        sensor_characteristic->notify();
        
        sensor.disableLed();

      }else if(splittedStatusValue[1] == "5"){ // calibrate

        sensor.enableLed();

        sensor_characteristic->setValue("BEGIN");
        sensor_characteristic->notify();

        delay(2500);

        string sensorData = sensor.sensorData();
        sensor_characteristic->setValue(sensorData);
        sensor_characteristic->notify();

        sensor_characteristic->setValue("END");
        sensor_characteristic->notify();

        sensor.disableLed();

      }

    }

  }
};

/**
 * @brief Start bluetooth services
 * 
 */
void startBluetoothServices(){
  BLEDevice::init("INCUBATOR");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  BLEService *pService = pServer->createService(SERVICE_UUID);

  delay(100);

  sensor_characteristic = pService->createCharacteristic(SENSOR_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE |
    BLECharacteristic::PROPERTY_NOTIFY);

  pService->start();

  pServer->getAdvertising()->start();

  sensor_characteristic->setValue("0");

  sensor_characteristic->setCallbacks(new CharacteristicsCallbacks());

  Serial.println("Waiting for a connection.");
}






void setup(){
  Serial.begin(115200);
  sensor.sensorSetup();

  startBluetoothServices();
}

void loop(){


}