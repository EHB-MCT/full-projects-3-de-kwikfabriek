#include <Arduino.h>

// sensor libs hier

#include <Adafruit_TCS34725.h>

// sensor pin

class Sensor{

  private:
    int sensorPin = 0;
    int ledPin = 32;
    int value = 0;
    Adafruit_TCS34725 tcs;

  public:
    Sensor(int pSensorPin, int pLedPin);
    void sensorSetup();
    int sensorData();

    void enableLed();
    void disableLed();
};

// dtostrf(sensor.sensorData(), 6, 2, sensorValue);