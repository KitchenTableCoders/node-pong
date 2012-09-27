/******

nodeArduinoWiFly / Ted Hayes

Talks to a node.js server via a Roving Networks RN-XV WiFly module.
Full description: http://log.liminastudio.com/programming/getting-started-with-the-rn-xv-wifi-module-node-js
Uses WiFly Shield Library: https://github.com/jcrouchley/WiFly-Shield

******/

#define PIN_VERT      0  // analog
#define PIN_HOR       1  // analog

#define PIN_PUSH      2
#define PIN_LED_RED   3
#define PIN_LED_GRN   4
#define PIN_LED_STATUS 13  // onboard LED

int vert = 0;
int hor = 0;
bool push;

void blinkLED(int blinkTimes){
  // for status indication
  for(int i=0; i<blinkTimes; i++){
    digitalWrite(PIN_LED_STATUS, HIGH);
    delay(100);
    digitalWrite(PIN_LED_STATUS, LOW);
    delay(100);
  }
}

void setup(){
  pinMode(PIN_PUSH, INPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GRN, OUTPUT);
  pinMode(PIN_LED_STATUS, OUTPUT);
  
  digitalWrite(PIN_PUSH, HIGH);    // set pull-up resistor
  digitalWrite(PIN_LED_RED, LOW);  // start off
  digitalWrite(PIN_LED_GRN, LOW);
  
  blinkLED(2);
  
  Serial.begin(38400);
  
  delay(70000);  // wait for WiFly to get connected
  blinkLED(5);

  Serial.print("$$$");
  delay(250);
  Serial.println("open 169.254.119.182 5001");
  delay(500);
 
  digitalWrite(PIN_LED_STATUS, HIGH);
  digitalWrite(PIN_LED_GRN, HIGH);
}

void loop(){
  vert = analogRead(PIN_VERT);
  hor = analogRead(PIN_HOR);
  push = digitalRead(PIN_PUSH);

  Serial.print(vert);
  Serial.print('\t');
  Serial.print(hor);
  Serial.print('\t');
  Serial.print(push);
  Serial.println();

  delay(100);
}
