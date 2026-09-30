import { useState, useEffect, useRef, useCallback } from "react";

const NAMES = ["RED", "YELLOW", "GREEN"] as const;

interface Preset {
  name: string;
  periods: [number, number, number];
  lcm: number;
}

const PRESETS: Preset[] = [
  { name: "105s (3.0s, 5.0s, 7.0s)", periods: [3000, 5000, 7000], lcm: 105000 },
  { name: "30s (1.5s, 2.0s, 2.5s)", periods: [1500, 2000, 2500], lcm: 30000 },
  { name: "12s (2.0s, 3.0s, 4.0s)", periods: [2000, 3000, 4000], lcm: 12000 },
];

const TEAM_MEMBERS = [
  { name: "Joel Duke", role: "Embedded Systems / Logic", initials: "JD" },
  { name: "Joel Geo Manuel", role: "Firmware Architecture", initials: "JM" },
  { name: "Johan Geo", role: "Hardware Pinout & Circuitry", initials: "JG" },
  { name: "Johaan Sam", role: "CRT Mathematical Modeling", initials: "JS" },
  { name: "Jose Alex", role: "Timing Diagrams & Gantt Charts", initials: "JA" },
  { name: "Joseph Alex", role: "Digital Twin / Web Interface", initials: "JA" },
  { name: "Joseph J", role: "Web Audio API Synthesizer", initials: "JJ" },
  { name: "Justin Joe Mathew", role: "System Integration & Testing", initials: "JM" },
  { name: "Jyothika Prakash", role: "Priority Scheduler Analysis", initials: "JP" },
  { name: "Jyothis Liju", role: "Documentation & Verification", initials: "JL" },
];

const ARDUINO_SOURCE = `const int RED_A = 2;
const int YELLOW_A = 3;
const int GREEN_A = 4;

const int RED_B = 8;
const int YELLOW_B = 9;
const int GREEN_B = 10;

const int GREEN_C = A3;
const int YELLOW_C = A4;
const int RED_C = A5;

const int BUZZER = A1;

const unsigned long PERIOD_A = 3000;
const unsigned long PERIOD_B = 5000;
const unsigned long PERIOD_C = 7000;
const unsigned long MASTER_CYCLE = 105000;

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
}`;

function mathMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function getSignalPhase(t: number, period: number): number {
  const rem = mathMod(t, period);
  const phaseDuration = period / 3;
  return Math.min(2, Math.floor(rem / phaseDuration));
}

export function TrafficLab() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [paused, setPaused] = useState(false);
  const [showLightShow, setShowLightShow] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Target Seeker state
  const [targetA, setTargetA] = useState(0);
  const [targetB, setTargetB] = useState(0);
  const [targetC, setTargetC] = useState(0);
  const [solvedTime, setSolvedTime] = useState<number | null>(0);

  // Real-time animation states
  const [simTime, setSimTime] = useState(0);
  const simTimeRef = useRef(0);
  const lastRealTimeRef = useRef(performance.now());
  const forcedSyncUntilRef = useRef(0);
  const pausedRef = useRef(false);
  const showLightShowRef = useRef(false);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Sync ref with states
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    showLightShowRef.current = showLightShow;
  }, [showLightShow]);

  // Audio setup
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainNodeRef.current = gain;
    }
  }, []);

  const updateAudio = useCallback((freq: number, active: boolean) => {
    if (!soundEnabled || !audioCtxRef.current || !gainNodeRef.current || !oscRef.current) return;
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    const now = audioCtxRef.current.currentTime;
    if (!active || freq === 0) {
      gainNodeRef.current.gain.setTargetAtTime(0, now, 0.02);
    } else {
      oscRef.current.frequency.setTargetAtTime(freq, now, 0.015);
      gainNodeRef.current.gain.setTargetAtTime(0.06, now, 0.02);
    }
  }, [soundEnabled]);

  // Main animation frame loop
  useEffect(() => {
    let animationId: number;

    const tick = (now: number) => {
      const dt = now - lastRealTimeRef.current;
      lastRealTimeRef.current = now;

      if (!pausedRef.current) {
        simTimeRef.current += dt;
        setSimTime(simTimeRef.current);
      }

      animationId = requestAnimationFrame(tick);
    };

    lastRealTimeRef.current = performance.now();
    animationId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Compute live states
  const t = showLightShow ? simTime * 4 : simTime;
  const currentHyperperiod = activePreset.lcm;
  const baseClock = mathMod(t, currentHyperperiod);
  const currentCycleIndex = Math.floor(t / currentHyperperiod) + 1;
  const isForcedSync = performance.now() < forcedSyncUntilRef.current;

  const states = activePreset.periods.map(p => getSignalPhase(t, p));
  const minRedDuration = Math.min(600, Math.min(...activePreset.periods) / 3);
  const allRed = states.every(s => s === 0);
  const isSync = (allRed && baseClock < minRedDuration) || isForcedSync;

  // Handle audio triggers
  useEffect(() => {
    if (isSync) {
      updateAudio(1000, !paused);
    } else {
      updateAudio(0, false);
    }
  }, [isSync, paused, updateAudio]);

  // Solve target remainder combination
  const solveTarget = useCallback(() => {
    let match: number | null = null;
    const step = 50;
    for (let curT = 0; curT < currentHyperperiod; curT += step) {
      if (
        getSignalPhase(curT, activePreset.periods[0]) === targetA &&
        getSignalPhase(curT, activePreset.periods[1]) === targetB &&
        getSignalPhase(curT, activePreset.periods[2]) === targetC
      ) {
        match = curT;
        break;
      }
    }
    setSolvedTime(match);
  }, [activePreset.periods, currentHyperperiod, targetA, targetB, targetC]);

  useEffect(() => {
    solveTarget();
  }, [solveTarget]);

  const seekToMatch = () => {
    if (solvedTime !== null) {
      simTimeRef.current = solvedTime;
      setSimTime(solvedTime);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ARDUINO_SOURCE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const progressPct = (baseClock / currentHyperperiod) * 100;

  return (
    <div className="space-y-8 text-[#e6edf3]">
      {/* Top Banner & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2b394e] bg-gradient-to-r from-[#111724] to-[#0a0f18] p-5 shadow-lg">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#52d6ff]">
            Real-Time Synchronization Engine
          </span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            CRT Traffic Light Lab
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-[#8ca0b8] sm:text-sm">
            Hardware digital twin mirroring an ATmega328P prototype. Demonstrates multi-frequency phase drift and Chinese Remainder Theorem convergence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (!soundEnabled) {
                initAudio();
                setSoundEnabled(true);
              } else {
                setSoundEnabled(false);
                updateAudio(0, false);
              }
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
              soundEnabled
                ? "border-[#52d6ff] bg-[#122c42] text-[#52d6ff]"
                : "border-[#2b394e] bg-[#111722] text-[#8ca0b8] hover:bg-[#1a2333]"
            }`}
          >
            {soundEnabled ? "🔊 Audio Active" : "🔇 Audio Muted"}
          </button>

          <button
            type="button"
            onClick={() => setShowTeamModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#2b394e] bg-[#111722] px-3 py-2 text-xs font-bold text-[#c0cde0] transition hover:bg-[#1a2333]"
          >
            👥 Team (10)
          </button>

          <button
            type="button"
            onClick={() => setShowDocsModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#2b394e] bg-[#111722] px-3 py-2 text-xs font-bold text-[#c0cde0] transition hover:bg-[#1a2333]"
          >
            📖 Pinout Specs
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#2b394e] bg-[#0c121c] px-3.5 py-1.5 text-xs font-semibold text-[#edf2f7]">
            <span
              className="h-2.5 w-2.5 rounded-full transition-all duration-300"
              style={{
                background: isSync ? "#52d6ff" : "#31e981",
                boxShadow: isSync ? "0 0 14px #52d6ff" : "0 0 10px #31e981",
              }}
            />
            <span>{isSync ? "🔔 CRT SYNC ACTIVE" : paused ? "SIMULATION PAUSED" : "RUNNING (DRIFTING)"}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Signals Array + CRT Engine */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: Physical Lights */}
        <div className="rounded-2xl border border-[#1f2a3a] bg-[#0d131d] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Live Signal Array</h3>
            <span className="rounded-md border border-[#233346] bg-[#131c2a] px-2.5 py-1 text-[11px] font-semibold text-[#8ca0b8]">
              ATmega328P View
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {activePreset.periods.map((period, k) => {
              const s = states[k];
              const letters = ["A", "B", "C"];
              const borderColors = ["#ff3b4e", "#ffd43b", "#31e981"];

              return (
                <div
                  key={letters[k]}
                  className="relative overflow-hidden rounded-xl border border-[#1b2535] bg-[#080c14] p-3 text-center"
                >
                  <div
                    className="absolute top-0 right-0 left-0 h-1"
                    style={{ background: borderColors[k] }}
                  />
                  <div className="mb-2 flex items-baseline justify-between text-xs">
                    <strong className="font-mono text-white">SIG {letters[k]}</strong>
                    <span className="font-mono text-[#52d6ff]">{(period / 1000).toFixed(1)}s</span>
                  </div>

                  <div className="inline-flex flex-col gap-2 rounded-2xl border-2 border-[#202b3c] bg-[#101622] p-2 shadow-inner">
                    {[0, 1, 2].map((i) => {
                      const isOn = s === i;
                      const glowMap = [
                        "bg-[#ff3b4e] shadow-[0_0_22px_#ff3b4e] border-[#ff8592]",
                        "bg-[#ffd43b] shadow-[0_0_22px_#ffd43b] border-[#ffe580]",
                        "bg-[#31e981] shadow-[0_0_22px_#31e981] border-[#79f5b2]",
                      ];

                      return (
                        <div
                          key={i}
                          className={`h-11 w-11 rounded-full border-2 transition-all duration-150 sm:h-12 sm:w-12 ${
                            isOn ? glowMap[i] : "border-[#253042] bg-[#17202c]"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-2.5">
                    <span
                      className={`inline-block rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${
                        s === 0
                          ? "border-[#ff3b4e44] bg-[#ff3b4e18] text-[#ff6b7a]"
                          : s === 1
                          ? "border-[#ffd43b44] bg-[#ffd43b18] text-[#ffd43b]"
                          : "border-[#31e98144] bg-[#31e98118] text-[#31e981]"
                      }`}
                    >
                      {NAMES[s]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[#080d14] shadow transition hover:bg-gray-100"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => {
                simTimeRef.current = 0;
                setSimTime(0);
                forcedSyncUntilRef.current = performance.now() + 1500;
              }}
              className="rounded-lg border border-[#2b394e] bg-[#162130] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#202f44]"
            >
              ⚡ Force Re-Sync
            </button>
            <button
              type="button"
              onClick={() => setShowLightShow((l) => !l)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                showLightShow
                  ? "border-[#52d6ff] bg-[#102d42] text-[#52d6ff]"
                  : "border-[#2b394e] bg-[#162130] text-white hover:bg-[#202f44]"
              }`}
            >
              ✨ Light Show
            </button>
            <button
              type="button"
              onClick={() => {
                simTimeRef.current = 0;
                setSimTime(0);
                setPaused(false);
                setShowLightShow(false);
                forcedSyncUntilRef.current = 0;
              }}
              className="rounded-lg border border-[#63272e] bg-[#221316] px-3.5 py-2 text-xs font-semibold text-[#ff8592] transition hover:bg-[#32181d]"
            >
              ↺ Reset
            </button>
          </div>

          {/* Preset Selector */}
          <div className="mt-5 border-t border-[#1f2a3a] pt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-bold text-white">CRT Remainder & Period Combinations:</span>
              <span className="font-mono text-[#52d6ff]">LCM = {(activePreset.lcm / 1000).toFixed(0)}s</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setActivePreset(p);
                    simTimeRef.current = 0;
                    setSimTime(0);
                  }}
                  className={`flex flex-col items-center rounded-xl border p-2.5 text-xs transition ${
                    activePreset.name === p.name
                      ? "border-[#52d6ff] bg-[#102b3f] text-[#52d6ff] shadow-[0_0_12px_#52d6ff33]"
                      : "border-[#1c2738] bg-[#090d14] text-[#8ca0b8] hover:bg-[#121a28]"
                  }`}
                >
                  <strong className="font-mono text-sm text-white">{p.name.split(" ")[0]}</strong>
                  <span className="text-[10px] text-[#71869e]">
                    ({(p.periods[0] / 1000).toFixed(1)}s, {(p.periods[1] / 1000).toFixed(1)}s, {(p.periods[2] / 1000).toFixed(1)}s)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Seeker */}
          <div className="mt-4 rounded-xl border border-[#1c2738] bg-[#080d16] p-3.5 text-xs">
            <div className="mb-2 flex items-center justify-between font-bold text-white">
              <span>🔍 CRT Remainder State Seeker</span>
              <span className="text-[11px] font-normal text-[#8ca0b8]">Solve for timestamp t</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="flex items-center gap-1 text-[#8ca0b8]">
                A:
                <select
                  value={targetA}
                  onChange={(e) => setTargetA(Number(e.target.value))}
                  className="rounded bg-[#121a28] px-2 py-1 text-xs text-white border border-[#233346]"
                >
                  <option value={0}>RED</option>
                  <option value={1}>YELLOW</option>
                  <option value={2}>GREEN</option>
                </select>
              </label>

              <label className="flex items-center gap-1 text-[#8ca0b8]">
                B:
                <select
                  value={targetB}
                  onChange={(e) => setTargetB(Number(e.target.value))}
                  className="rounded bg-[#121a28] px-2 py-1 text-xs text-white border border-[#233346]"
                >
                  <option value={0}>RED</option>
                  <option value={1}>YELLOW</option>
                  <option value={2}>GREEN</option>
                </select>
              </label>

              <label className="flex items-center gap-1 text-[#8ca0b8]">
                C:
                <select
                  value={targetC}
                  onChange={(e) => setTargetC(Number(e.target.value))}
                  className="rounded bg-[#121a28] px-2 py-1 text-xs text-white border border-[#233346]"
                >
                  <option value={0}>RED</option>
                  <option value={1}>YELLOW</option>
                  <option value={2}>GREEN</option>
                </select>
              </label>

              <button
                type="button"
                onClick={seekToMatch}
                disabled={solvedTime === null}
                className="rounded bg-[#16273c] px-3 py-1 text-xs font-semibold text-[#52d6ff] border border-[#284160] hover:bg-[#1d334e] disabled:opacity-40"
              >
                Seek to Match
              </button>
            </div>
            <div className="mt-2 font-mono text-[11px] text-[#8ca0b8]">
              {solvedTime !== null ? (
                <span>
                  Match occurs at: <b className="text-[#52d6ff]">t = {(solvedTime / 1000).toFixed(2)}s</b>
                </span>
              ) : (
                <span className="text-[#e27373]">Combination not reachable in this LCM cycle.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Telemetry & Formula Engine */}
        <div className="rounded-2xl border border-[#1f2a3a] bg-[#0d131d] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">CRT Telemetry Engine</h3>
            <span className="rounded-md border border-[#233346] bg-[#131c2a] px-2.5 py-1 text-[11px] font-semibold text-[#52d6ff]">
              {(activePreset.lcm / 1000).toFixed(0)}s Recurrence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[#1b2535] bg-[#080c14] p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ca0b8]">Period Set</span>
              <strong className="mt-1 block font-mono text-sm text-white">
                {(activePreset.periods[0] / 1000).toFixed(1)}s / {(activePreset.periods[1] / 1000).toFixed(1)}s / {(activePreset.periods[2] / 1000).toFixed(1)}s
              </strong>
            </div>

            <div className="rounded-xl border border-[#1b2535] bg-[#080c14] p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ca0b8]">Hyperperiod LCM</span>
              <strong className="mt-1 block font-mono text-base text-[#52d6ff]">
                {(activePreset.lcm / 1000).toFixed(2)} s
              </strong>
            </div>

            <div className="rounded-xl border border-[#1b2535] bg-[#080c14] p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ca0b8]">Clock Progress</span>
              <strong className="mt-1 block font-mono text-sm text-white">
                {(baseClock / 1000).toFixed(2)}s / {(currentHyperperiod / 1000).toFixed(0)}s
              </strong>
            </div>

            <div className="rounded-xl border border-[#1b2535] bg-[#080c14] p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ca0b8]">Recurrence Index</span>
              <strong className="mt-1 block font-mono text-sm text-[#bf7af0]">
                Cycle #{currentCycleIndex}
              </strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#17212e]">
            <div
              className="h-full bg-gradient-to-r from-[#52d6ff] to-[#bf7af0] transition-all duration-75"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Math Box */}
          <div className="mt-4 space-y-1 rounded-xl border border-[#1b2535] bg-[#080c14] p-3 font-mono text-xs text-[#9eb1c7]">
            <div><b className="text-[#52d6ff]">CRT Modular Recurrence:</b> t ≡ 0 (mod LCM)</div>
            <div>• LCM({(activePreset.periods[0] / 1000).toFixed(1)}s, {(activePreset.periods[1] / 1000).toFixed(1)}s, {(activePreset.periods[2] / 1000).toFixed(1)}s) = <b className="text-white">{(activePreset.lcm / 1000).toFixed(0)} seconds</b></div>
            <div>• Cycles per LCM: A: {activePreset.lcm / activePreset.periods[0]} | B: {activePreset.lcm / activePreset.periods[1]} | C: {activePreset.lcm / activePreset.periods[2]}</div>
            <div>• Buzzer chime: <b className="text-[#52d6ff]">Only on synchronization (t ≡ 0)</b></div>
          </div>

          {/* Live Remainder Table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-[#1b2535]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#101724] text-[#788da4]">
                <tr>
                  <th className="p-2.5">Signal</th>
                  <th className="p-2.5">Remainder (t mod T)</th>
                  <th className="p-2.5">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2535] bg-[#080c14]">
                {activePreset.periods.map((period, k) => {
                  const rem = (mathMod(t, period) / 1000).toFixed(2);
                  const names = ["A", "B", "C"];
                  const s = states[k];
                  return (
                    <tr key={names[k]}>
                      <td className="p-2.5 font-bold text-white">Sig {names[k]} ({(period / 1000).toFixed(1)}s)</td>
                      <td className="p-2.5 text-[#52d6ff]">{rem} s</td>
                      <td className="p-2.5 font-bold">
                        <span className={s === 0 ? "text-[#ff6b7a]" : s === 1 ? "text-[#ffd43b]" : "text-[#31e981]"}>
                          {NAMES[s]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Multi-Track Gantt Timing Diagram */}
      <div className="rounded-2xl border border-[#1f2a3a] bg-[#0d131d] p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Multi-Channel Phase Waveform</h3>
            <p className="text-xs text-[#7d92a9]">
              White cursor sweeps across the {(activePreset.lcm / 1000).toFixed(0)}s hyperperiod. Cyan vertical line marks simultaneous alignment.
            </p>
          </div>
          <span className="rounded-md border border-[#233346] bg-[#131c2a] px-2.5 py-1 font-mono text-xs text-[#52d6ff]">
            Window: 0.00s → {(activePreset.lcm / 1000).toFixed(2)}s
          </span>
        </div>

        <div className="space-y-2">
          {activePreset.periods.map((period, k) => {
            const letters = ["A", "B", "C"];
            const slices = 120;
            const sliceDur = activePreset.lcm / slices;

            return (
              <div key={letters[k]} className="flex items-center gap-3">
                <span className="w-14 font-mono text-xs font-bold text-[#8ca0b8]">SIG {letters[k]}</span>
                <div className="relative flex h-5 flex-1 overflow-hidden rounded-md border border-[#1c2738] bg-[#080c14]">
                  {Array.from({ length: slices }).map((_, idx) => {
                    const sliceTime = (idx + 0.5) * sliceDur;
                    const phase = getSignalPhase(sliceTime, period);
                    const color = phase === 0 ? "#ff3b4e" : phase === 1 ? "#ffd43b" : "#31e981";
                    return (
                      <div
                        key={idx}
                        className="h-full flex-1 opacity-40 transition-opacity"
                        style={{ background: color }}
                      />
                    );
                  })}

                  {/* Sweep cursor */}
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_8px_#ffffff]"
                    style={{ left: `${progressPct}%` }}
                  />

                  {/* Sync end marker */}
                  <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-5 w-0.5 bg-[#52d6ff] shadow-[0_0_8px_#52d6ff]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Arduino Code Viewer */}
      <div className="rounded-2xl border border-[#1f2a3a] bg-[#0b0f16] p-5 shadow-2xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">💻 Arduino Nano Physical Firmware</h3>
            <span className="font-mono text-xs text-[#52d6ff]">arduino/traffic_light_controller.ino</span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-2 rounded-xl border border-[#2b394e] bg-[#121c29] px-3.5 py-1.5 text-xs font-bold text-[#52d6ff] transition hover:bg-[#1a293c]"
          >
            {copied ? "✓ Copied to Clipboard!" : "📋 Copy Arduino Code"}
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-3 rounded-lg border border-[#182332] bg-[#070b12] p-2.5 font-mono text-[11px] text-[#8ca0b8]">
          <span><b>Signal A:</b> Pin 2 (Red), Pin 3 (Yellow), Pin 4 (Green)</span>
          <span>•</span>
          <span><b>Signal B:</b> Pin 8 (Red), Pin 9 (Yellow), Pin 10 (Green)</span>
          <span>•</span>
          <span><b>Signal C:</b> Pin A5 (Red), Pin A4 (Yellow), Pin A3 (Green)</span>
          <span>•</span>
          <span><b>Buzzer:</b> Pin A1</span>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-xl border border-[#16202d] bg-[#06080d] p-4">
          <pre className="font-mono text-xs leading-relaxed text-[#c9d5e4] whitespace-pre">
            {ARDUINO_SOURCE}
          </pre>
        </div>
      </div>

      {/* Footer Credits */}
      <footer className="border-t border-[#1f2a3a] pt-6 text-center text-xs text-[#718096]">
        <p className="font-bold text-white">CRT Traffic Light Lab • Embedded Real-Time Systems Project (2026)</p>
        <p className="mt-1">
          Engineered by {TEAM_MEMBERS.map((m) => m.name).join(", ")}.
        </p>
        <p className="mt-1">Released under the MIT License.</p>
      </footer>

      {/* Team Modal */}
      {showTeamModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowTeamModal(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#283549] bg-[#0f1520] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">👥 Project Engineering Team</h3>
              <button
                type="button"
                onClick={() => setShowTeamModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-xs text-[#8ca0b8]">
              The CRT Traffic Light Lab was designed, built, and mathematically verified by:
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {TEAM_MEMBERS.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-xl border border-[#1c2637] bg-[#080c14] p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#182638] font-bold text-[#52d6ff]">
                    {m.initials}
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-white">{m.name}</strong>
                    <span className="text-[11px] text-[#71869e]">{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pinout Docs Modal */}
      {showDocsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowDocsModal(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#283549] bg-[#0f1520] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">📖 Hardware Pinout & Specs</h3>
              <button
                type="button"
                onClick={() => setShowDocsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-xs text-[#b8cadc]">
              <div>
                <h4 className="font-bold text-[#52d6ff]">ATmega328P Pin Allocation</h4>
                <div className="mt-2 overflow-hidden rounded-lg border border-[#1e2a3c]">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-[#121a28] text-[#788da4]">
                      <tr>
                        <th className="p-2">Signal</th>
                        <th className="p-2">Pin Mapping</th>
                        <th className="p-2">Base Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2a3c] bg-[#080d16]">
                      <tr><td className="p-2 font-bold text-white">Signal A</td><td className="p-2">Red=2, Yel=3, Grn=4</td><td className="p-2 text-[#52d6ff]">1500 ms</td></tr>
                      <tr><td className="p-2 font-bold text-white">Signal B</td><td className="p-2">Red=8, Yel=9, Grn=10</td><td className="p-2 text-[#52d6ff]">2000 ms</td></tr>
                      <tr><td className="p-2 font-bold text-white">Signal C</td><td className="p-2">Red=A5, Yel=A4, Grn=A3</td><td className="p-2 text-[#52d6ff]">2500 ms</td></tr>
                      <tr><td className="p-2 font-bold text-white">Buzzer</td><td className="p-2">PWM Output Pin A1</td><td className="p-2 text-[#52d6ff]">1000 Hz Sync</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#52d6ff]">Acoustic Sync Parameters</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li><b>SYNC_TIME:</b> 600 ms continuous 1000 Hz chime at start and each 30s cycle.</li>
                  <li><b>BEEP_ON_TIME:</b> 150 ms active beep cadence.</li>
                  <li><b>BEEP_OFF_TIME:</b> 350 ms silence interval.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
