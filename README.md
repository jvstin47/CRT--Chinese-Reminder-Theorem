# CRT Exploratorium: Chinese Remainder Theorem Laboratory

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF.svg)](https://vitejs.dev)
[![Arduino Nano](https://img.shields.io/badge/Hardware-Arduino%20Nano%20%28ATmega328P%29-00979D.svg)](arduino/)

A comprehensive interactive laboratory exploring the **Chinese Remainder Theorem (CRT)** across two complementary domains:
1. **The Mechanical Lock Box:** A discrete, spatial puzzle box demonstrating modular congruence solving.
2. **The Real-Time Traffic Light Lab:** A temporal digital twin demonstrating multi-rate periodic signal synchronization with physical Arduino Nano firmware.

---

## 1. Application Modalities

```
                     Chinese Remainder Theorem (CRT)
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
[ 🔐 Mechanical Lock Box ]                             [ 🚦 Traffic Light Lab ]
  Domain: Spatial / Discrete                             Domain: Temporal / Real-Time
  Model: Cardboard rotating notched dials                Model: 3-Signal Arduino Nano prototype
  Math: x ≡ r_i (mod m_i)                                Math: t ≡ 0 (mod LCM)
  Outcome: Sliding rod clears to open box                Outcome: Recurrent phase alignment & chime
```

### Mode 1: Mechanical CRT Lock Box
* Rebuilds a cardboard puzzle box in code with realistic physics-inspired dials, sliding rods, and latches.
* Players turn dials to solve systems of linear congruences:
  $$x \equiv r_1 \pmod{m_1}, \quad x \equiv r_2 \pmod{m_2}, \quad x \equiv r_3 \pmod{m_3}$$
* When all conditions are satisfied, internal wheel notches align perfectly, allowing the physical locking rod to slide through and release the door latch.

### Mode 2: Real-Time Signal Synchronization Lab
* Digital twin of a physical Arduino Nano prototype controlling three independent traffic signal clusters with mutually non-harmonic cycle periods ($T_A, T_B, T_C$).
* Demonstrates modular remainder divergence and hyperperiod recurrence at integer multiples of the Least Common Multiple:
  $$t_{\text{sync}} \in \{k \times \text{LCM}(T_A, T_B, T_C) \mid k \in \mathbb{N}\}$$
* **Presets:** 30s Standard $(1.5\text{s}, 2.0\text{s}, 2.5\text{s})$, 60s Extended $(3.0\text{s}, 4.0\text{s}, 5.0\text{s})$, and 12s Harmonic $(2.0\text{s}, 3.0\text{s}, 4.0\text{s})$.
* **CRT Remainder State Seeker:** Solves for the exact timestamp $t$ where any user-selected phase combination occurs.
* **Acoustic Alignment Beacon:** Native Web Audio API chime sounds a $1000\text{ Hz}$ tone *exclusively* upon mutual synchronization.

---

## 2. Hardware Implementation (Arduino Nano)

The physical firmware is located under [`arduino/traffic_light_controller.ino`](arduino/traffic_light_controller.ino) and is embedded directly within the web application.

### Pinout Mapping

| Component | Pin Constant | Arduino Nano Pin | Function | Sub-Phase |
| :--- | :--- | :--- | :--- | :--- |
| **Signal A - Red** | `RED_A` | `Pin 2` | Digital Output | $0 \le t < 500\text{ ms}$ |
| **Signal A - Yellow** | `YELLOW_A` | `Pin 3` | Digital Output | $500 \le t < 1000\text{ ms}$ |
| **Signal A - Green** | `GREEN_A` | `Pin 4` | Digital Output | $1000 \le t < 1500\text{ ms}$ |
| **Signal B - Red** | `RED_B` | `Pin 8` | Digital Output | $0 \le t < 667\text{ ms}$ |
| **Signal B - Yellow** | `YELLOW_B` | `Pin 9` | Digital Output | $667 \le t < 1333\text{ ms}$ |
| **Signal B - Green** | `GREEN_B` | `Pin 10` | Digital Output | $1333 \le t < 2000\text{ ms}$ |
| **Signal C - Red** | `RED_C` | `Pin A5` | Analog / Digital Output | $0 \le t < 833\text{ ms}$ |
| **Signal C - Yellow** | `YELLOW_C` | `Pin A4` | Analog / Digital Output | $833 \le t < 1667\text{ ms}$ |
| **Signal C - Green** | `GREEN_C` | `Pin A3` | Analog / Digital Output | $1667 \le t < 2500\text{ ms}$ |
| **Piezo Buzzer** | `BUZZER` | `Pin A1` | PWM Output | Sync chime ($1000\text{ Hz}$) |

---

## 3. Project Setup & Local Development

### Prerequisites
* **Node.js:** `>= 20.14.0`
* **npm:** `>= 10.0.0`

### Installation
```bash
# Clone the repository
git clone https://github.com/jvstin47/CRT--Chinese-Reminder-Theorem.git
cd CRT--Chinese-Reminder-Theorem

# Install dependencies
npm install

# Run Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 4. Engineering Team & Credits

This project was developed as a collaborative mathematical and embedded systems laboratory project by:

* **Joel Duke**
* **Joel Geo Manuel**
* **Johan Geo**
* **Johaan Sam**
* **Jose Alex**
* **Joseph Alex**
* **Joseph J**
* **Justin Joe Mathew**
* **Jyothika Prakash**
* **Jyothis Liju**

---

## 5. License

This project is open source and licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
