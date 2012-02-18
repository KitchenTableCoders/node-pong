/*
  nodeArduino Ethernet / Ted Hayes
  Uses the WizNet ethernet shield
  
 */

#include <SPI.h>
#include <Ethernet.h>

#define PIN_VERT      0  // analog
#define PIN_HOR       1  // analog

#define PIN_PUSH      2
#define PIN_LED_RED   3
#define PIN_LED_GRN   4

int vert = 0;
int hor = 0;
bool push;

// Enter a MAC address and IP address for your controller below.
// The IP address will be dependent on your local network:
byte mac[] = {  
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = { 
  192,168,1,15 };

// Enter the IP address of the server you're connecting to:
byte server[] = { 
  192,168,1,103 }; 

// Initialize the Ethernet client library
// with the IP address and port of the server 
// that you want to connect to (port 23 is default for telnet;
// if you're using Processing's ChatServer, use  port 10002):
//EthernetClient client(server, 5001);
EthernetClient client;

void setup() {
  pinMode(PIN_PUSH, INPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GRN, OUTPUT);
  
  digitalWrite(PIN_PUSH, HIGH);    // set pull-up resistor
  digitalWrite(PIN_LED_RED, LOW);  // start off
  digitalWrite(PIN_LED_GRN, LOW);
  
  // start the Ethernet connection:
  Ethernet.begin(mac, ip);
  // start the serial library:
  Serial.begin(9600);
  // give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:
//  if (client.connect()) {
//    Serial.println("connected");
//    digitalWrite(PIN_LED_GRN, HIGH);
//  } else {
//    // if you didn't get a connection to the server:
//    Serial.println("connection failed");
//  }
  if (client.connect(server, 5001)) {
    Serial.println("connected");
    //client.println("GET /search?q=arduino HTTP/1.0");
    //client.println();
  } else {
    Serial.println("connection failed");
  }
}

void loop()
{
  vert = analogRead(PIN_VERT);
  hor = analogRead(PIN_HOR);
  push = digitalRead(PIN_PUSH);
  
  digitalWrite(PIN_LED_RED, !push);
  
//  Serial.print(vert);
//  Serial.print('\t');
//  Serial.print(hor);
//  Serial.print('\t');
//  Serial.print(push);
//  Serial.println();
  
  client.print(vert);
  client.print('\t');
  client.print(hor);
  client.print('\t');
  client.print(push);
  client.println();
  delay(100);
  
  // if there are incoming bytes available 
  // from the server, read them and print them:
//  if (client.available()) {
//    char c = client.read();
//    Serial.print(c);
//  }
//
//  // as long as there are bytes in the serial queue,
//  // read them and send them out the socket if it's open:
//  while (Serial.available() > 0) {
//    char inChar = Serial.read();
//    if (client.connected()) {
//      client.print(inChar); 
//    }
//  }

  // if the server's disconnected, stop the client:
//  if (!client.connected()) {
//    Serial.println();
//    Serial.println("disconnecting.");
//    client.stop();
//    // do nothing:
//    while(true);
//  }
}




