# 📄 Project Assignment Report: Traffic Signal Synchronization System

**Project Title:** Traffic Signal Synchronization System Using Chinese Remainder Theorem  
**Course / Assignment:** Number Theory & Discrete Mathematics Application  
**Team Leadership:** Justin Joe Mathew (Team Lead)  

---

## 💡 Does Traffic Signal Synchronization Demo CRT or just LCM/GCD?

### Mathematical Distinction:
1. **LCM (Least Common Multiple) / GCD:**  
   Used when all signals start at **Minute 0 with NO remainder/offset**. If Signal 1 (3 min), Signal 2 (5 min), and Signal 3 (7 min) all turn green at Minute 0, the next simultaneous green light is simply $\text{LCM}(3, 5, 7) = 105$ minutes.

2. **CRT (Chinese Remainder Theorem):**  
   **REQUIRED when signals have DIFFERENT REMAINDERS / OFFSETS.**  
   In our project scenario:
   - Signal 1 (3-min cycle) turned green 2 minutes ago $\rightarrow x \equiv 2 \pmod 3$
   - Signal 2 (5-min cycle) turned green 3 minutes ago $\rightarrow x \equiv 3 \pmod 5$
   - Signal 3 (7-min cycle) turned green 2 minutes ago $\rightarrow x \equiv 2 \pmod 7$

   Because the remainders ($2, 3, 2$) are non-zero and distinct, **LCM cannot solve this problem**. The system requires the **Chinese Remainder Theorem** (Extended Euclidean Algorithm & Modular Inverses) to solve for the unique green wave minute ($x = 23$).

👉 **Conclusion:** The project is a **genuine demonstration of CRT**, specifically showcasing why CRT is needed over simple LCM when real-world cycles start at different offsets.

---

## 📷 Physical Hardware Prototype & Digital Twin Interface

The project includes both a physical Arduino Nano breadboard circuit and a full digital twin web simulator.  
**Interactive Web App & Project Repository:** https://github.com/jvstin47/CRT--Chinese-Reminder-Theorem

![CRT Traffic Light Lab Dashboard](/Users/justin/Public/projects/CRT/docs/dashboard_lab.png)

![Multi-Channel Phase Waveform & Telemetry](/Users/justin/Public/projects/CRT/docs/dashboard_waveform.png)

![Arduino Nano Physical Breadboard Prototype - Perspective View](/Users/justin/Public/projects/CRT/docs/hardware_perspective.jpg)

![Arduino Nano Physical Breadboard Prototype - Top View](/Users/justin/Public/projects/CRT/docs/hardware_topdown.jpg)

---

## 👥 Group Member Roles & Work Division (10 Members)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PROJECT TEAM STRUCTURE                               │
├─────────────────────────────────────┬──────────────────────────────────────────────────┤
│ 1. Project Leadership & Model       │ Justin Joe Mathew (Team Lead) & Jyothis Liju     │
│ 2. Hardware Sourcing & Build Testing│ Joseph Alex & Joseph J                           │
│ 3. Web Design & Frontend            │ Johan Geo & Johaan Sam                           │
│ 4. Presentation & Showcase          │ Joel Geo Manuel                                  │
│ 5. Mathematics & Applications       │ Joel Duke, Jyothika Prakash, & Jose Alex         │
└─────────────────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 📝 Detailed Team Member Contribution Breakdown

### 1. Project Leadership & Working Model Construction
👥 **Team Members:** **Justin Joe Mathew (Team Lead)** & **Jyothis Liju**
- **Justin Joe Mathew (Team Lead):** Organized team work, built the physical 3-light breadboard model, and wrote the Arduino C++ code (`traffic_light_controller.ino`) for signal timing and buzzer sounds.
- **Jyothis Liju:** Co-developed the breadboard circuit model, plugging in LEDs to digital pins 2–10, connecting the buzzer to pin A1, and testing hardware timing against the written code.

### 2. Hardware Sourcing & Application Research
👥 **Team Members:** **Joseph Alex** & **Joseph J**
- **Joseph Alex:** Bought the Arduino Nano board, breadboards, 220Ω resistors, LEDs, and buzzer, tested circuit connections, and checked pin voltage outputs.
- **Joseph J:** Handled component acquisition, tested circuit wiring, and researched real-world uses like city traffic light timing, fiber-optic channels, and computer processors.

### 3. Web Design & Web App Development
👥 **Team Members:** **Johan Geo** & **Johaan Sam**
- **Johan Geo:** Designed the dark theme visual layout, circular LED monitors, interactive dials, and responsive dashboard cards.
- **Johaan Sam:** Built the website logic using React and TypeScript, coded the animation timer, remainder solver, buzzer sound triggers, and cross-device testing.

### 4. Presentation & Demo Walkthrough
👥 **Team Member:** **Joel Geo Manuel**
- **Joel Geo Manuel:** Wrote the 2-speaker presentation script between Alex and Sam over team practice sessions, designed the demo slide layout, and timed the acoustic buzzer chime.

### 5. Mathematics & Educational Content
👥 **Team Members:** **Joel Duke**, **Jose Alex**, & **Jyothika Prakash**
- **Joel Duke:** Worked out the 3s, 5s, and 7s cycle equations, coprimality proofs, and modulo inverse calculations ($y_1=2, y_2=1, y_3=1$).
- **Jose Alex:** Double-checked all modulo inverse calculations by hand, verified solution bounds ($M=105$), and checked edge cases for accuracy.
- **Jyothika Prakash:** Created the 3-step hint system on the website and wrote clear, simple guides explaining remainder modulo concepts without complex textbook jargon.
