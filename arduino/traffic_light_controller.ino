/*
 * ==============================================================================
 * Project: CRT Traffic Light Lab (Embedded Real-Time Controller)
 * Target Hardware: Arduino Nano / Uno (Arduino Nano)
 * License: MIT License
 * 
 * Authors & Engineering Team:
 *   - Joel Duke
 *   - Joel Geo Manuel
 *   - Johan Geo
 *   - Johaan Sam
 *   - Jose Alex
 *   - Joseph Alex
 *   - Joseph J
 *   - Justin Joe Mathew
 *   - Jyothika Prakash
 *   - Jyothis Liju
 * ==============================================================================
 */

const int RED_A = 2;
const int YELLOW_A = 3;
const int GREEN_A = 4;

const int RED_B = 8;
const int YELLOW_B = 9;
const int GREEN_B = 10;

const int GREEN_C = A3;
const int YELLOW_C = A4;
const int RED_C = A5;

const int BUZZER = A1;

const unsigned long PERIOD_A = 1500;
const unsigned long PERIOD_B = 2000;
const unsigned long PERIOD_C = 2500;
const unsigned long MASTER_CYCLE = 30000;

const int RED_FREQ = 400;
const int YELLOW_FREQ = 600;
const int GREEN_FREQ = 800;
const int SYNC_FREQ = 1000;

const unsigned long BEEP_ON_TIME = 150;
const unsigned long BEEP_OFF_TIME = 350;
const unsigned long SYNC_TIME = 600;

unsigned long lastMillis = 0;
unsigned long lastSyncCycle = 0;
unsigned long beepTimer = 0;
unsigned long syncEndTime = 0;

bool beepState = false;
bool syncActive = false;

int currentBuzzerState = -1;

void setup() {
  pinMode(RED_A, OUTPUT);
  pinMode(YELLOW_A, OUTPUT);
  pinMode(GREEN_A, OUTPUT);

  pinMode(RED_B, OUTPUT);
  pinMode(YELLOW_B, OUTPUT);
  pinMode(GREEN_B, OUTPUT);

  pinMode(RED_C, OUTPUT);
  pinMode(YELLOW_C, OUTPUT);
  pinMode(GREEN_C, OUTPUT);

  pinMode(BUZZER, OUTPUT);

  setAllRed();

  tone(BUZZER, SYNC_FREQ);
  syncActive = true;
  syncEndTime = millis() + SYNC_TIME;

  lastMillis = millis();
  beepTimer = millis();
}

void loop() {
  unsigned long currentMillis = millis();

  unsigned long phaseA = currentMillis % PERIOD_A;
  unsigned long phaseB = currentMillis % PERIOD_B;
  unsigned long phaseC = currentMillis % PERIOD_C;

  int stateA = updateLightA(phaseA);
  int stateB = updateLightB(phaseB);
  int stateC = updateLightC(phaseC);

  unsigned long currentCycle = currentMillis / MASTER_CYCLE;

  if (currentCycle > lastSyncCycle) {
    lastSyncCycle = currentCycle;

    tone(BUZZER, SYNC_FREQ);
    syncActive = true;
    syncEndTime = currentMillis + SYNC_TIME;

    beepState = false;
  }

  if (syncActive) {
    if (currentMillis >= syncEndTime) {
      noTone(BUZZER);
      syncActive = false;
      beepTimer = currentMillis;
      beepState = false;
      currentBuzzerState = -1;
    }
    return;
  }

  int newBuzzerState = getBuzzerState(stateA, stateB, stateC);

  if (newBuzzerState != currentBuzzerState) {
    currentBuzzerState = newBuzzerState;
    noTone(BUZZER);
    beepState = false;
    beepTimer = currentMillis;
  }

  if (!beepState) {
    if (currentMillis - beepTimer >= BEEP_OFF_TIME) {

      if (currentBuzzerState == 0) {
        tone(BUZZER, RED_FREQ);
      }
      else if (currentBuzzerState == 1) {
        tone(BUZZER, YELLOW_FREQ);
      }
      else {
        tone(BUZZER, GREEN_FREQ);
      }

      beepState = true;
      beepTimer = currentMillis;
    }
  }
  else {
    if (currentMillis - beepTimer >= BEEP_ON_TIME) {
      noTone(BUZZER);
      beepState = false;
      beepTimer = currentMillis;
    }
  }
}

int updateLightA(unsigned long phase) {
  if (phase < 500) {
    digitalWrite(RED_A, HIGH);
    digitalWrite(YELLOW_A, LOW);
    digitalWrite(GREEN_A, LOW);
    return 0;
  }
  else if (phase < 1000) {
    digitalWrite(RED_A, LOW);
    digitalWrite(YELLOW_A, HIGH);
    digitalWrite(GREEN_A, LOW);
    return 1;
  }
  else {
    digitalWrite(RED_A, LOW);
    digitalWrite(YELLOW_A, LOW);
    digitalWrite(GREEN_A, HIGH);
    return 2;
  }
}

int updateLightB(unsigned long phase) {
  if (phase < 667) {
    digitalWrite(RED_B, HIGH);
    digitalWrite(YELLOW_B, LOW);
    digitalWrite(GREEN_B, LOW);
    return 0;
  }
  else if (phase < 1333) {
    digitalWrite(RED_B, LOW);
    digitalWrite(YELLOW_B, HIGH);
    digitalWrite(GREEN_B, LOW);
    return 1;
  }
  else {
    digitalWrite(RED_B, LOW);
    digitalWrite(YELLOW_B, LOW);
    digitalWrite(GREEN_B, HIGH);
    return 2;
  }
}

int updateLightC(unsigned long phase) {
  if (phase < 833) {
    digitalWrite(RED_C, HIGH);
    digitalWrite(YELLOW_C, LOW);
    digitalWrite(GREEN_C, LOW);
    return 0;
  }
  else if (phase < 1667) {
    digitalWrite(RED_C, LOW);
    digitalWrite(YELLOW_C, HIGH);
    digitalWrite(GREEN_C, LOW);
    return 1;
  }
  else {
    digitalWrite(RED_C, LOW);
    digitalWrite(YELLOW_C, LOW);
    digitalWrite(GREEN_C, HIGH);
    return 2;
  }
}

int getBuzzerState(int stateA, int stateB, int stateC) {
  if (stateA == 0 || stateB == 0 || stateC == 0) {
    return 0;
  }

  if (stateA == 1 || stateB == 1 || stateC == 1) {
    return 1;
  }

  return 2;
}

void setAllRed() {
  digitalWrite(RED_A, HIGH);
  digitalWrite(YELLOW_A, LOW);
  digitalWrite(GREEN_A, LOW);

  digitalWrite(RED_B, HIGH);
  digitalWrite(YELLOW_B, LOW);
  digitalWrite(GREEN_B, LOW);

  digitalWrite(RED_C, HIGH);
  digitalWrite(YELLOW_C, LOW);
  digitalWrite(GREEN_C, LOW);
}
