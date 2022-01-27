#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

#include <sensor.h>

// BLE SECTION
BLEServer *pServer = NULL;

BLECharacteristic *sensor_characteristic = NULL;
BLECharacteristic *status_characteristic = NULL;

int status = 0;
// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

#define SENSOR_CHARACTERISTIC_UUID "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"
#define STATUS_CHARACTERISTIC_UUID "f27b53ad-c63d-49a0-8c0f-9f297e6cc520"

Sensor sensor(A0);

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    Serial.println("Connected");
  };

  void onDisconnect(BLEServer *pServer)
  {
    Serial.println("Disconnected");
  }
};

class CharacteristicsCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    Serial.print("Value Written ");
    Serial.println(pCharacteristic->getValue().c_str());
    const char statusValue = *pCharacteristic->getValue().c_str();

    if (pCharacteristic == status_characteristic){

      if(statusValue == '2'){
        status = 2;
        sensor.enableLed();
        delay(5000);
        sensor.disableLed();
        status = 3;
      }
    }
  }
};

void setup()
{
  Serial.begin(115200);

  sensor.sensorSetup();

  // Create the BLE Device
  BLEDevice::init("INCUBATOR");
  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);
  delay(100);

  // Create a BLE Characteristic
  sensor_characteristic = pService->createCharacteristic(
      SENSOR_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  status_characteristic = pService->createCharacteristic(
      STATUS_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  // Start the BLE service
  pService->start();

  // Start advertising
  pServer->getAdvertising()->start();

  sensor_characteristic->setValue("0");
  sensor_characteristic->setCallbacks(new CharacteristicsCallbacks());

  status_characteristic->setValue("0");
  status_characteristic->setCallbacks(new CharacteristicsCallbacks());

  Serial.println("Waiting for a client connection to notify...");
}

void loop()
{

  //if(status == 2){
    char sensorValue[6] = "";
    sensor_characteristic->setValue(dtostrf(sensor.sensorData(), 4, 0, sensorValue));
    sensor_characteristic->notify();

    delay(50);
  //}
  

  // sensor_characteristic->setValue("Message Two");
  // sensor_characteristic->notify();

  // delay(1000);
}