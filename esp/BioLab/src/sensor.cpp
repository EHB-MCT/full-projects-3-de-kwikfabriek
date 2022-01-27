#include "sensor.h"

Sensor::Sensor(int pSensorPin, int pLedPin){
  sensorPin = pSensorPin;
  ledPin = pLedPin;
}

/**
 * @brief Setup sensor
 * 
 */
void Sensor::sensorSetup() {
  tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);
  if (tcs.begin()) {
    Serial.println("Found sensor");
    pinMode(ledPin, OUTPUT);
    disableLed();
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    // while (1);
  }
}

/**
 * @brief Enable LED on sensor
 * 
 */
void Sensor::enableLed() {
  digitalWrite(ledPin, HIGH);
}

/**
 * @brief Disable LED on sensor
 * 
 */
void Sensor::disableLed(){
  digitalWrite(ledPin, LOW);
}

/**
 * @brief Receive current sensor data
 * 
 * @return int 
 */
string Sensor::sensorData(){
  uint16_t r, g, b, c, colorTemp, lux;
  tcs.getRawData(&r, &g, &b, &c);
  // colorTemp = tcs.calculateColorTemperature(r, g, b);
  //colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  lux = tcs.calculateLux(r, g, b);

  Serial.print(r);
  Serial.print("-");
  Serial.print(g);
  Serial.print("-");
  Serial.print(b);
  Serial.print("-");
  Serial.println(c);

  if((r > 99999 || g > 99999 || b > 99999) || (r == 0 || g == 0 || b == 0)){

    Serial.println("Bad value");

    return "BAD";

  }else{

    char rValue [6];
    sprintf(rValue, "%u", r);
    char gValue [6];
    sprintf(gValue, "%u", g);
    char bValue [6];
    sprintf(bValue, "%u", b);
    char cValue [6];
    sprintf(cValue, "%u", c);

    string sensorValue = std::string(rValue) + "," + std::string(gValue) + "," + std::string(bValue) + "," + std::string(cValue);
    char charSensorValue[sensorValue.length() + 1];
    strcpy(charSensorValue, sensorValue.c_str());

    Serial.println(charSensorValue);

    return sensorValue;

  }

  
}