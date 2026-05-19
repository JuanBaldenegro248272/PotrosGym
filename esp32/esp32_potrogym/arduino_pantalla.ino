#include <SoftwareSerial.h>
#include <MCUFRIEND_kbv.h>
#include <Adafruit_GFX.h>

SoftwareSerial espSerial(10, A5);
MCUFRIEND_kbv tft;

#define BLACK   0x0000
#define BLUE    0x001F
#define RED     0xF800
#define GREEN   0x07E0
#define CYAN    0x07FF
#define WHITE   0xFFFF
#define YELLOW  0xFFE0

String ultimoAnuncio = "";
String bufferSerial = "";

bool temaClaro = false;
bool pantallaDormida = false;

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);
  espSerial.listen();

  uint16_t ID = tft.readID();

  if (ID == 0xD3D3 || ID == 0xFFFF || ID == 0x0000) ID = 0x9486;
  if (ID == 0x9485) ID = 0x9486;

  tft.begin(ID);
  tft.setRotation(1);

  mostrarEspera();
  mostrarAnuncio("Esperando ESP32");
}

void loop() {
  while (espSerial.available()) {
    char c = espSerial.read();

    if (c == '\n') {
      bufferSerial.trim();

      if (bufferSerial.length() > 0) {
        procesarMensaje(bufferSerial);
      }

      bufferSerial = "";
    } else if (c != '\r') {
      bufferSerial += c;
    }
  }
}

void procesarMensaje(String mensaje) {
  Serial.println(mensaje);

  if (mensaje == "DORMIR") {
    mostrarDormir();
  } else if (mensaje == "ESPERA") {
    mostrarEspera();
  } else if (mensaje == "VALIDANDO") {
    mostrarValidando();
  } else if (mensaje == "DENEGADO") {
    mostrarDenegado();
  } else if (mensaje == "REGISTRO_OK") {
    mostrarRegistroOK();
  } else if (mensaje == "REGISTRO_ERROR") {
    mostrarRegistroError();
  } else if (mensaje == "TEMA|CLARO") {
    temaClaro = true;
    if (!pantallaDormida) mostrarEspera();
  } else if (mensaje == "TEMA|OSCURO") {
    temaClaro = false;
    if (!pantallaDormida) mostrarEspera();
  } else if (mensaje.startsWith("REGISTRO|")) {
    String texto = mensaje.substring(9);
    mostrarRegistro(texto);
  } else if (mensaje.startsWith("BIENVENIDO|")) {
    String nombre = mensaje.substring(11);
    mostrarBienvenido(nombre);
  } else if (mensaje.startsWith("ANUNCIO|")) {
    ultimoAnuncio = mensaje.substring(8);
    if (!pantallaDormida) mostrarAnuncio(ultimoAnuncio);
  }
}

void mostrarDormir() {
  pantallaDormida = true;
  tft.fillScreen(BLACK);
}

void mostrarEspera() {
  pantallaDormida = false;

  uint16_t fondo = temaClaro ? WHITE : BLACK;
  uint16_t titulo = temaClaro ? RED : YELLOW;
  uint16_t texto = temaClaro ? BLACK : WHITE;

  tft.fillScreen(fondo);

  tft.setTextColor(titulo, fondo);
  tft.setTextSize(4);
  centrarTexto("POTRO GYM", 45);

  tft.setTextColor(texto, fondo);
  tft.setTextSize(3);
  centrarTexto("COLOQUE SU HUELLA", 145);

  if (ultimoAnuncio.length() > 0) {
    mostrarAnuncio(ultimoAnuncio);
  }
}

void mostrarAnuncio(String texto) {
  uint16_t fondo = temaClaro ? WHITE : BLACK;
  uint16_t colorAnuncio = temaClaro ? BLUE : CYAN;

  tft.fillRect(0, 230, 480, 90, fondo);
  tft.setTextColor(colorAnuncio, fondo);

  if (texto.length() > 24) {
    tft.setTextSize(1);
  } else {
    tft.setTextSize(2);
  }

  centrarTexto(texto, 265);
}

void mostrarValidando() {
  pantallaDormida = false;
  tft.fillScreen(BLUE);

  tft.setTextColor(WHITE, BLUE);
  tft.setTextSize(4);
  centrarTexto("VALIDANDO...", 135);
}

void mostrarBienvenido(String nombre) {
  pantallaDormida = false;
  tft.fillScreen(GREEN);

  tft.setTextColor(BLACK, GREEN);
  tft.setTextSize(4);
  centrarTexto("BIENVENIDO", 90);

  tft.setTextSize(3);
  centrarTexto(nombre, 165);
}

void mostrarDenegado() {
  pantallaDormida = false;
  tft.fillScreen(RED);

  tft.setTextColor(WHITE, RED);
  tft.setTextSize(4);
  centrarTexto("NO REGISTRADO", 115);

  tft.setTextSize(2);
  centrarTexto("Consulte en recepcion", 180);
}

void mostrarRegistro(String texto) {
  pantallaDormida = false;
  tft.fillScreen(BLUE);

  tft.setTextColor(WHITE, BLUE);
  tft.setTextSize(4);
  centrarTexto("REGISTRO", 70);

  tft.setTextSize(3);
  centrarTexto(texto, 155);
}

void mostrarRegistroOK() {
  pantallaDormida = false;
  tft.fillScreen(GREEN);

  tft.setTextColor(BLACK, GREEN);
  tft.setTextSize(4);
  centrarTexto("LISTO", 90);

  tft.setTextSize(3);
  centrarTexto("Huella guardada", 165);
}

void mostrarRegistroError() {
  pantallaDormida = false;
  tft.fillScreen(RED);

  tft.setTextColor(WHITE, RED);
  tft.setTextSize(4);
  centrarTexto("ERROR", 90);

  tft.setTextSize(3);
  centrarTexto("Intente otra vez", 165);
}

void centrarTexto(String texto, int y) {
  int16_t x1, y1;
  uint16_t w, h;

  tft.getTextBounds(texto, 0, y, &x1, &y1, &w, &h);

  int x = (480 - w) / 2;
  if (x < 0) x = 0;

  tft.setCursor(x, y);
  tft.print(texto);
}