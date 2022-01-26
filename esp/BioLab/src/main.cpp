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
int status = 0;
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

      if(splittedStatusValue[1] == "2"){

        // send status 2 to app

        // start analysing
        status = 2;
        sensor.enableLed();
        
        delay(1000);

        sensor_characteristic->setValue("BEGIN");
        sensor_characteristic->notify();

        for (size_t i = 0; i < 10; i++)
        {
          char sensorValue[6] = "";
          sensor_characteristic->setValue(dtostrf(sensor.sensorData(), 4, 0, sensorValue));
          sensor_characteristic->notify();

          delay(100);
        }

        sensor_characteristic->setValue("END");
        sensor_characteristic->notify();
        

        // stop analysing
        sensor.disableLed();
        status = 3;

        // send status 3 to App
        // sensor_characteristic->setValue("status:3");
        // sensor_characteristic->notify();

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