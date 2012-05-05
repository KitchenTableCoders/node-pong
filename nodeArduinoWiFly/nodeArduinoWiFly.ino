/******

nodeArduinoWiFly / Ted Hayes

Talks to a node.js server via a Roving Networks RN-XV WiFly module.
Full description: http://log.liminastudio.com/programming/getting-started-with-the-rn-xv-wifi-module-node-js
Uses WiFly Shield Library: https://github.com/jcrouchley/WiFly-Shield

******/

#include <SPI.h>
#include <WiFly.h>

#define PIN_VERT      0  // analog
#define PIN_HOR       1  // analog

#define PIN_PUSH      2
#define PIN_LED_RED   3
#define PIN_LED_GRN   4
#define PIN_LED_STATUS 13  // onboard LED

int vert = 0;
int hor = 0;
bool push;

char* ssid = "Vibromonk2";
char* pass = "VibroMonk718";

char* serverAddress = "10.0.25.103";
int serverPort = 5001;

//Client client(serverAddress, serverPort);
WiFlyClient client;

void setup(){
  pinMode(PIN_PUSH, INPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GRN, OUTPUT);
  pinMode(PIN_LED_STATUS, OUTPUT);
  
  digitalWrite(PIN_PUSH, HIGH);    // set pull-up resistor
  digitalWrite(PIN_LED_RED, LOW);  // start off
  digitalWrite(PIN_LED_GRN, LOW);
  
  Serial.begin(9600);
  WiFly.setUart(&Serial);
  WiFly.begin();
  
  if (!WiFly.join(ssid, pass, true)) {
    digitalWrite(PIN_LED_RED, HIGH);
    while (1) {
      // Hang on failure.
    }
  }
  
  digitalWrite(PIN_LED_GRN, HIGH);
  
  if (client.connect(serverAddress, serverPort)) {
    client.println("ohai!");
    client.println();
    digitalWrite(PIN_LED_STATUS, HIGH);
  } else {
    // do nothing
  }
}

void loop(){
  vert = analogRead(PIN_VERT);
  hor = analogRead(PIN_HOR);
  push = digitalRead(PIN_PUSH);
  
  digitalWrite(PIN_LED_RED, !push);
  
  client.print(vert);
  client.print('\t');
  client.print(hor);
  client.print('\t');
  client.print(push);
  client.println();
  delay(10);
}
