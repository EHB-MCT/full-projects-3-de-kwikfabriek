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
int Sensor::sensorData(){
  uint16_t r, g, b, c, colorTemp, lux;
  tcs.getRawData(&r, &g, &b, &c);
  // colorTemp = tcs.calculateColorTemperature(r, g, b);
  colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  lux = tcs.calculateLux(r, g, b);

  // Serial.print("Color Temp: "); Serial.print(colorTemp, DEC); Serial.print(" K - ");
  // Serial.print("Lux: "); Serial.print(lux, DEC); Serial.print(" - ");
  // Serial.print("R: "); Serial.print(r, DEC); Serial.print(" ");
  // Serial.print("G: "); Serial.print(g, DEC); Serial.print(" ");
  Serial.print("B: "); Serial.print(b, DEC); Serial.print(" ");
  // Serial.print("C: "); Serial.print(c, DEC); Serial.print(" ");
  Serial.println(" ");


  return b;
}