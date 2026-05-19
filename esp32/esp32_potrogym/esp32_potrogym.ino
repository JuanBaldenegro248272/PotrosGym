#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Fingerprint.h>
#include <ESP32Servo.h>

const char* ssid = "internetd";
const char* password = "password";
const char* serverUrl = "http://ipDelaPcConectada:8000";

#define FINGER_RX 16
#define FINGER_TX 17
#define SCREEN_TX 26

#define ULTRASONICO_TRIG 32
#define ULTRASONICO_ECHO 35
#define DISTANCIA_ACTIVACION_CM 10
#define TIEMPO_PANTALLA_ACTIVA 15000

#define LDR_PIN 34
#define UMBRAL_LUZ 1800

#define SERVO_PIN 25
#define SERVO_ABIERTO 90
#define SERVO_CERRADO 0
#define DURACION_PUERTA_ABIERTA 30000

HardwareSerial fingerSerial(2);
HardwareSerial screenSerial(1);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&fingerSerial);
Servo servoPuerta;

String anuncios[5];
int totalAnuncios = 0;
int indiceAnuncio = 0;

bool pantallaActiva = false;
bool sensorDetectado = false;
bool registrandoHuella = false;
bool puertaAbierta = false;
bool modoClaro = false;
bool ultimoModoClaro = false;

unsigned long ultimaPresencia = 0;
unsigned long ultimoAnuncio = 0;
unsigned long ultimoActualizarAnuncios = 0;
unsigned long ultimoCheckRegistro = 0;
unsigned long tiempoAperturaPuerta = 0;
unsigned long ultimoCheckLuz = 0;

void setup() {
  Serial.begin(115200);

  fingerSerial.begin(57600, SERIAL_8N1, FINGER_RX, FINGER_TX);
  finger.begin(57600);

  screenSerial.begin(9600, SERIAL_8N1, -1, SCREEN_TX);

  pinMode(ULTRASONICO_TRIG, OUTPUT);
  pinMode(ULTRASONICO_ECHO, INPUT);
  pinMode(LDR_PIN, INPUT);

  servoPuerta.attach(SERVO_PIN);
  servoPuerta.write(SERVO_CERRADO);

  enviarPantalla("DORMIR");

  sensorDetectado = finger.verifyPassword();

  if (sensorDetectado) {
    Serial.println("Sensor de huella detectado");
  } else {
    Serial.println("Sensor de huella NO detectado");
  }

  Serial.print("Conectando WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi conectado");
  Serial.print("IP ESP32: ");
  Serial.println(WiFi.localIP());

  obtenerAnuncios();

  if (totalAnuncios == 0) {
    anuncios[0] = "Sistema listo";
    totalAnuncios = 1;
  }

  actualizarTemaPorLuz(true);
}

void loop() {
  actualizarMotor();
  actualizarTemaPorLuz(false);

  if (millis() - ultimoCheckRegistro > 3000) {
    revisarOrdenRegistro();
    ultimoCheckRegistro = millis();
  }

  if (registrandoHuella) return;

  actualizarPresencia();

  if (!pantallaActiva) {
    delay(100);
    return;
  }

  if (millis() - ultimoActualizarAnuncios > 30000) {
    obtenerAnuncios();

    if (totalAnuncios == 0) {
      anuncios[0] = "Sistema listo";
      totalAnuncios = 1;
    }

    ultimoActualizarAnuncios = millis();
  }

  if (millis() - ultimoAnuncio > 10000) {
    rotarAnuncio();
    ultimoAnuncio = millis();
  }

  if (sensorDetectado) {
    int id = getFingerprintID();

    if (id > 0) {
      Serial.print("Huella detectada ID: ");
      Serial.println(id);
      procesarAcceso(id);
    }
  }
}

void actualizarTemaPorLuz(bool forzar) {
  if (!forzar && millis() - ultimoCheckLuz < 1000) return;
  ultimoCheckLuz = millis();

  int luz = analogRead(LDR_PIN);
  modoClaro = luz > UMBRAL_LUZ;

  if (forzar || modoClaro != ultimoModoClaro) {
    ultimoModoClaro = modoClaro;

    if (modoClaro) {
      enviarPantalla("TEMA|CLARO");
      Serial.println("Tema claro");
    } else {
      enviarPantalla("TEMA|OSCURO");
      Serial.println("Tema oscuro");
    }

    Serial.print("Luz: ");
    Serial.println(luz);
  }
}

void actualizarMotor() {
  if (puertaAbierta && millis() - tiempoAperturaPuerta >= DURACION_PUERTA_ABIERTA) {
    servoPuerta.write(SERVO_CERRADO);
    puertaAbierta = false;
    Serial.println("Puerta cerrada");
  }
}

void activarMotor() {
  servoPuerta.write(SERVO_ABIERTO);
  puertaAbierta = true;
  tiempoAperturaPuerta = millis();
  Serial.println("Puerta abierta");
}

void actualizarPresencia() {
  float distancia = medirDistanciaCM();
  bool hayPersona = distancia > 0 && distancia <= DISTANCIA_ACTIVACION_CM;

  if (hayPersona) {
    ultimaPresencia = millis();

    if (!pantallaActiva) {
      pantallaActiva = true;
      enviarPantalla("ESPERA");
      mostrarAnuncioActual();
    }

    return;
  }

  if (pantallaActiva && millis() - ultimaPresencia > TIEMPO_PANTALLA_ACTIVA) {
    pantallaActiva = false;
    enviarPantalla("DORMIR");
  }
}

float medirDistanciaCM() {
  digitalWrite(ULTRASONICO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONICO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONICO_TRIG, LOW);

  long duracion = pulseIn(ULTRASONICO_ECHO, HIGH, 25000);
  if (duracion == 0) return -1;

  return duracion * 0.0343 / 2.0;
}

void procesarAcceso(int id) {
  enviarPantalla("VALIDANDO");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverUrl) + "/esp32/acceso");
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<100> doc;
    doc["huellaID"] = id;

    String json;
    serializeJson(doc, json);

    int code = http.POST(json);

    if (code == 200) {
      String payload = http.getString();

      StaticJsonDocument<200> res;
      deserializeJson(res, payload);

      String nombre = res["nombre"] | "";
      enviarPantalla("BIENVENIDO|" + nombre);
      activarMotor();
    } else {
      enviarPantalla("DENEGADO");
    }

    http.end();
  } else {
    enviarPantalla("DENEGADO");
  }

  delay(3000);
  enviarPantalla("ESPERA");
  mostrarAnuncioActual();
}

int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -1;

  return finger.fingerID;
}

void revisarOrdenRegistro() {
  if (!sensorDetectado) return;
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(serverUrl) + "/esp32/status");

  int code = http.GET();

  if (code == 200) {
    String payload = http.getString();

    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (!error && doc["activo"] == true) {
      int id = doc["id"] | -1;

      if (id > 0) {
        registrandoHuella = true;
        pantallaActiva = true;

        uint8_t resultado = registrarHuella(id);

        if (resultado == FINGERPRINT_OK) {
          enviarPantalla("REGISTRO_OK");
          avisarRegistroCompleto();
        } else {
          enviarPantalla("REGISTRO_ERROR");
          cancelarRegistro();
        }

        delay(2500);
        enviarPantalla("ESPERA");
        mostrarAnuncioActual();

        registrandoHuella = false;
      }
    }
  }

  http.end();
}

uint8_t registrarHuella(int id) {
  int p = -1;

  enviarPantalla("REGISTRO|Ponga el dedo");

  while (p != FINGERPRINT_OK) {
    p = finger.getImage();

    if (p == FINGERPRINT_NOFINGER) {
      delay(100);
    } else if (p != FINGERPRINT_OK) {
      return p;
    }
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) return p;

  enviarPantalla("REGISTRO|Quite el dedo");
  delay(2000);

  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
    delay(100);
  }

  enviarPantalla("REGISTRO|Ponga el mismo dedo");

  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();

    if (p == FINGERPRINT_NOFINGER) {
      delay(100);
    } else if (p != FINGERPRINT_OK) {
      return p;
    }
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) return p;

  p = finger.createModel();
  if (p != FINGERPRINT_OK) return p;

  p = finger.storeModel(id);
  return p;
}

void avisarRegistroCompleto() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(serverUrl) + "/esp32/enroll_complete");
  http.POST("");
  http.end();
}

void cancelarRegistro() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(serverUrl) + "/esp32/enroll_cancel");
  http.POST("");
  http.end();
}

void obtenerAnuncios() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(serverUrl) + "/esp32/anuncios");

  int code = http.GET();

  if (code == 200) {
    String payload = http.getString();

    StaticJsonDocument<500> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      JsonArray arr = doc["anuncios"];
      totalAnuncios = 0;
      indiceAnuncio = 0;

      for (JsonVariant v : arr) {
        if (totalAnuncios < 5) {
          anuncios[totalAnuncios++] = v.as<String>();
        }
      }

      Serial.print("Anuncios cargados: ");
      Serial.println(totalAnuncios);
    }
  } else {
    Serial.print("Error anuncios HTTP: ");
    Serial.println(code);
  }

  http.end();
}

void rotarAnuncio() {
  if (totalAnuncios == 0) return;

  indiceAnuncio = (indiceAnuncio + 1) % totalAnuncios;
  mostrarAnuncioActual();
}

void mostrarAnuncioActual() {
  if (totalAnuncios == 0) return;
  enviarPantalla("ANUNCIO|" + anuncios[indiceAnuncio]);
}

void enviarPantalla(String mensaje) {
  screenSerial.println(mensaje);
  Serial.println("Pantalla: " + mensaje);
}