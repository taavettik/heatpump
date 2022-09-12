#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include<ArduinoJson.h>
// 10th, January 2016 - Fun with ESP8266
// (c)  Vincent Cruvellier
//  The Sketch use an ESP 8266 to read DHT sensor Values, Send HVAC IR command and sleep.
//
// I have used ESP 8266 ESP-12 Module
//  the IR led Emitter should be drive from a 5V current. You can power the IR LED from the 3.3V but the 
//  emission distance will be considerably reduced. The bes is to drive the IR led from 5V and drive through 
//  a transitor the led emission (Signal). Caution a lot of IR-Led module do not have real Signal drive.
//  Indeed, lot of them have Signal directly connected to VDD.
//
// Sketch Exemple with ESP8266 + HVAC IR Emission Capability + DHT Reading
// Sketch has been very simplified to not use IR-Remote lib but just what we need for this example
//   Mean we need just to be able to send HVAC IR command.
// ESP Deep sleep Feauture is used on this sketch. That requires ESP/RST connected to ESP/GPIO16 
//   in order to wakeup from the deep sleep.
//
// Hardware Connection
//  IR LED SIGNAL => ESP/GPIO_4
//  DHT SIGNAL => ESP/GPIO_5
// RESET => ESP/GPIO_16


// ------------------
// Mitsubishi AC routines
// ------------------

#define ERROR_PIN 12
#define OK_PIN 13

int halfPeriodicTime;
int IRpin;
int khz;

typedef enum HvacMode {
  HVAC_HOT,
  HVAC_COLD,
  HVAC_DRY,
  HVAC_FAN, // used for Panasonic only
  HVAC_AUTO
} HvacMode_t; // HVAC  MODE

typedef enum HvacFanMode {
  FAN_SPEED_1,
  FAN_SPEED_2,
  FAN_SPEED_3,
  FAN_SPEED_4,
  FAN_SPEED_5,
  FAN_SPEED_AUTO,
  FAN_SPEED_SILENT
} HvacFanMode_;  // HVAC  FAN MODE

typedef enum HvacVanneMode {
  VANNE_AUTO,
  VANNE_H1,
  VANNE_H2,
  VANNE_H3,
  VANNE_H4,
  VANNE_H5,
  VANNE_AUTO_MOVE
} HvacVanneMode_;  // HVAC  VANNE MODE

typedef enum HvacWideVanneMode {
  WIDE_LEFT_END,
  WIDE_LEFT,
  WIDE_MIDDLE,
  WIDE_RIGHT,
  WIDE_RIGHT_END
} HvacWideVanneMode_t;  // HVAC  WIDE VANNE MODE

typedef enum HvacAreaMode {
  AREA_SWING,
  AREA_LEFT,
  AREA_AUTO,
  AREA_RIGHT
} HvacAreaMode_t;  // HVAC  WIDE VANNE MODE

typedef enum HvacProfileMode {
  NORMAL,
  QUIET,
  BOOST
} HvacProfileMode_t;  // HVAC PANASONIC OPTION MODE


// HVAC MITSUBISHI_
#define HVAC_MITSUBISHI_HDR_MARK    3400
#define HVAC_MITSUBISHI_HDR_SPACE   1750
#define HVAC_MITSUBISHI_BIT_MARK    450
#define HVAC_MITSUBISHI_ONE_SPACE   1300
#define HVAC_MISTUBISHI_ZERO_SPACE  420
#define HVAC_MITSUBISHI_RPT_MARK    440
#define HVAC_MITSUBISHI_RPT_SPACE   17100 // Above original iremote limit


/****************************************************************************
/* Send IR command to Mitsubishi HVAC - sendHvacMitsubishi
/***************************************************************************/
void sendHvacMitsubishi(
  HvacMode                HVAC_Mode,           // Example HVAC_HOT  HvacMitsubishiMode
  int                     HVAC_Temp,           // Example 21  (°c)
  HvacFanMode             HVAC_FanMode,        // Example FAN_SPEED_AUTO  HvacMitsubishiFanMode
  HvacVanneMode           HVAC_VanneMode,      // Example VANNE_AUTO_MOVE  HvacMitsubishiVanneMode
  int                     OFF                  // Example false
)
{

//#define  HVAC_MITSUBISHI_DEBUG;  // Un comment to access DEBUG information through Serial Interface

  byte mask = 1; //our bitmask
  byte data[18] = { 0x23, 0xCB, 0x26, 0x01, 0x00, 0x20, 0x08, 0x06, 0x30, 0x45, 0x67, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1F };
  // data array is a valid trame, only byte to be chnaged will be updated.

  byte i;

#ifdef HVAC_MITSUBISHI_DEBUG
  Serial.println("Packet to send: ");
  for (i = 0; i < 18; i++) {
    Serial.print("_");
    Serial.print(data[i], HEX);
  }
  Serial.println(".");
#endif

  // Byte 6 - On / Off
  if (OFF) {
    data[5] = (byte) 0x0; // Turn OFF HVAC
  } else {
    data[5] = (byte) 0x20; // Tuen ON HVAC
  }

  // Byte 7 - Mode
  switch (HVAC_Mode)
  {
    case HVAC_HOT:   data[6] = (byte) 0x08; break;
    case HVAC_COLD:  data[6] = (byte) 0x18; break;
    case HVAC_DRY:   data[6] = (byte) 0x10; break;
    case HVAC_AUTO:  data[6] = (byte) 0x20; break;
    default: break;
  }

  // Byte 8 - Temperature
  // Check Min Max For Hot Mode
  byte Temp;
  if (HVAC_Temp > 31) { Temp = 31;}
  else if (HVAC_Temp < 16) { Temp = 16; } 
  else { Temp = HVAC_Temp; };
  data[7] = (byte) Temp - 16;

  // Byte 10 - FAN / VANNE
  switch (HVAC_FanMode)
  {
    case FAN_SPEED_1:       data[9] = (byte) B00000001; break;
    case FAN_SPEED_2:       data[9] = (byte) B00000010; break;
    case FAN_SPEED_3:       data[9] = (byte) B00000011; break;
    case FAN_SPEED_4:       data[9] = (byte) B00000100; break;
    case FAN_SPEED_5:       data[9] = (byte) B00000100; break; //No FAN speed 5 for MITSUBISHI so it is consider as Speed 4
    case FAN_SPEED_AUTO:    data[9] = (byte) B10000000; break;
    case FAN_SPEED_SILENT:  data[9] = (byte) B00000101; break;
    default: break;
  }

  switch (HVAC_VanneMode)
  {
    case VANNE_AUTO:        data[9] = (byte) data[9] | B01000000; break;
    case VANNE_H1:          data[9] = (byte) data[9] | B01001000; break;
    case VANNE_H2:          data[9] = (byte) data[9] | B01010000; break;
    case VANNE_H3:          data[9] = (byte) data[9] | B01011000; break;
    case VANNE_H4:          data[9] = (byte) data[9] | B01100000; break;
    case VANNE_H5:          data[9] = (byte) data[9] | B01101000; break;
    case VANNE_AUTO_MOVE:   data[9] = (byte) data[9] | B01111000; break;
    default: break;
  }

  // Byte 18 - CRC
  data[17] = 0;
  for (i = 0; i < 17; i++) {
    data[17] = (byte) data[i] + data[17];  // CRC is a simple bits addition
  }

#ifdef HVAC_MITSUBISHI_DEBUG
  Serial.println("Packet to send: ");
  for (i = 0; i < 18; i++) {
    Serial.print("_"); Serial.print(data[i], HEX);
  }
  Serial.println(".");
  for (i = 0; i < 18; i++) {
    Serial.print(data[i], BIN); Serial.print(" ");
  }
  Serial.println(".");
#endif

  enableIROut(38);  // 38khz
  space(0);
  for (int j = 0; j < 2; j++) {  // For Mitsubishi IR protocol we have to send two time the packet data
    // Header for the Packet
    mark(HVAC_MITSUBISHI_HDR_MARK);
    space(HVAC_MITSUBISHI_HDR_SPACE);
    for (i = 0; i < 18; i++) {
      // Send all Bits from Byte Data in Reverse Order
      for (mask = 00000001; mask > 0; mask <<= 1) { //iterate through bit mask
        if (data[i] & mask) { // Bit ONE
          mark(HVAC_MITSUBISHI_BIT_MARK);
          space(HVAC_MITSUBISHI_ONE_SPACE);
        }
        else { // Bit ZERO
          mark(HVAC_MITSUBISHI_BIT_MARK);
          space(HVAC_MISTUBISHI_ZERO_SPACE);
        }
        //Next bits
      }
    }
    // End of Packet and retransmission of the Packet
    mark(HVAC_MITSUBISHI_RPT_MARK);
    space(HVAC_MITSUBISHI_RPT_SPACE);
    space(0); // Just to be sure
  }
}

/****************************************************************************
/* enableIROut : Set global Variable for Frequency IR Emission
/***************************************************************************/ 
void enableIROut(int khz) {
  // Enables IR output.  The khz value controls the modulation frequency in kilohertz.
  halfPeriodicTime = 500/khz; // T = 1/f but we need T/2 in microsecond and f is in kHz
}

/****************************************************************************
/* mark ( int time) 
/***************************************************************************/ 
void mark(int time) {
  // Sends an IR mark for the specified number of microseconds.
  // The mark output is modulated at the PWM frequency.
  long beginning = micros();
  while(micros() - beginning < time){
    digitalWrite(IRpin, HIGH);
    delayMicroseconds(halfPeriodicTime);
    digitalWrite(IRpin, LOW);
    delayMicroseconds(halfPeriodicTime); //38 kHz -> T = 26.31 microsec (periodic time), half of it is 13
  }
}

/****************************************************************************
/* space ( int time) 
/***************************************************************************/ 
/* Leave pin off for time (given in microseconds) */
void space(int time) {
  // Sends an IR space for the specified number of microseconds.
  // A space is no output, so the PWM output is disabled.
  digitalWrite(IRpin, LOW);
  if (time > 0) delayMicroseconds(time);
}

/****************************************************************************
/* sendRaw (unsigned int buf[], int len, int hz)
/***************************************************************************/ 
void sendRaw (unsigned int buf[], int len, int hz)
{
  enableIROut(hz);
  for (int i = 0; i < len; i++) {
    if (i & 1) {
      space(buf[i]);
    } 
    else {
      mark(buf[i]);
    }
  }
  space(0); // Just to be sure
}


// WIFI client setup


const char* ssid = "HUAWEI-B593-B6C7";
const char* password = "mandoliinim1es";

//Your Domain name with URL path or IP address with path
String serverName = "https://ac.kukkonen.dev/iot";

void setupWifi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting");

  boolean state = true;

  int startTime = millis();
  
  while(WiFi.status() != WL_CONNECTED && (millis() - startTime) < 30000) {
    digitalWrite(OK_PIN, state ? HIGH : LOW);
    digitalWrite(ERROR_PIN, LOW);
    delay(500);
    state = !state;
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}



/****************************************************************************
/* setup ()
*  Note: That's also the entry point after DeepSleep TimeOut 
*/
/***************************************************************************/

int temperature = 20;
HvacMode hvacMode = HVAC_HOT;
HvacFanMode fanSpeed = FAN_SPEED_AUTO;
boolean power = true;

void applyCommand(int newTemp, HvacMode newMode, HvacFanMode newFanSpeed, boolean newPower) {
  if (newTemp == temperature && newMode == hvacMode && fanSpeed == newFanSpeed && power == newPower) {
    return;
  }

  temperature = newTemp;
  hvacMode = newMode;
  fanSpeed = newFanSpeed;
  power = newPower;

  Serial.println("Sending to AC...");
  sendHvacMitsubishi(hvacMode, temperature, fanSpeed, VANNE_AUTO_MOVE, !power);
}

boolean fetchCommand() {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;

  boolean success = true;

  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  Serial.print("[HTTP] begin...\n");
  if (http.begin(client, serverName + "/command")) {
    Serial.print("[HTTP] GET...\n");
    // start connection and send HTTP header
    int httpCode = http.GET();

    if (httpCode < 0) {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      http.end();

      return false;
    }

    
    Serial.printf("[HTTP] GET... code: %d\n", httpCode);

    
    DynamicJsonDocument doc(1024);
        
    String payload = http.getString();
    deserializeJson(doc, payload);

    int temperature = doc["temperature"];
    HvacMode hvacMode = doc["mode"];
    HvacFanMode fanSpeed = doc["fanSpeed"];
    boolean power = doc["on"];

    Serial.println(String(temperature) + ", " + String(hvacMode) + ", " + String(fanSpeed) + ", " + (power ? "ON" : "OFF"));

    applyCommand(temperature, hvacMode, fanSpeed, power);
  } else {
    success = false;
  }

  http.end();

  return success;
}

boolean error = false;

// -------
// setup ()
// -------
void setup() {
  IRpin=4;
  khz=38;
  halfPeriodicTime = 500/khz;
  pinMode(IRpin, OUTPUT);
  pinMode(OK_PIN, OUTPUT);
  pinMode(ERROR_PIN, OUTPUT);
  Serial.begin(115200);

  setupWifi();
  setupOTA();

  digitalWrite(OK_PIN, HIGH);
}

/****************************************************************************
/* Loop ()
/***************************************************************************/
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    // attempt to reconnect if disconnected from wifi
    WiFi.disconnect();
    setupWifi();
  }
  
  handleOTA();
  boolean success = fetchCommand();
  error = !success;

  if (error) {
    digitalWrite(OK_PIN, LOW);
    digitalWrite(ERROR_PIN, HIGH);
    delay(10000);  
  } else {
    digitalWrite(OK_PIN, HIGH);
    digitalWrite(ERROR_PIN, LOW);
    delay(1000);
    digitalWrite(OK_PIN, LOW);
    delay(9000);
  }
}
