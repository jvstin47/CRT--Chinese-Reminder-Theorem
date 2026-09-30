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
👉 **Interactive Web App & Project Repository:** `https://github.com/jvstin47/CRT--Chinese-Reminder-Theorem` (Local Dev Server: `http://localhost:5173/`)

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
- **Justin Joe Mathew (Team Lead):** Led overall system architecture, physical 3-intersection breadboard prototype assembly, and written C++ firmware (`traffic_light_controller.ino`) for Arduino Nano timing and acoustic chime feedback. Established full integration with the digital twin web app.
- **Jyothis Liju:** Co-developed the physical working model, wiring digital output pins (Pins 2–10) and analog pins (A1, A3–A5), conducted real-time signal timing tests against C++ firmware modulo logic, and verified acoustic piezo chime synchronization.

### 2. Hardware Sourcing, Bench Testing & Application Design
👥 **Team Members:** **Joseph Alex** & **Joseph J**
- **Joseph Alex:** Selected and acquired physical electronic components, including Arduino Nano microcontrollers, breadboards, 220Ω resistors, 9 LED traffic clusters, and piezo buzzers. Executed bench testing, GPIO voltage verification, and continuity checks.
- **Joseph J:** Handled part procurement, assembly testing, and application domain research. Mapped CRT modular congruences to real-world intelligent transportation systems (ITS), fiber-optic telecommunications multiplexing, and parallel computing architectures.

### 3. Web Design & Frontend Engine Development
👥 **Team Members:** **Johan Geo** & **Johaan Sam**
- **Johan Geo:** Designed the complete visual layout, dark laboratory aesthetic, and responsive layout system using Tailwind CSS v4. Created custom SVG circular monitor displays, interactive dial controls, and status panels.
- **Johaan Sam:** Engineered the interactive web application frontend and state engine using React 19 and TypeScript. Developed 60 FPS animation loops, telemetry sweep cursors, dynamic CRT remainder solver, and Framer Motion transitions.

### 4. Presentation Pacing & Showcase Lead
👥 **Team Member:** **Joel Geo Manuel**
- **Joel Geo Manuel:** Authored the 2-speaker presentation script between driver Alex and tech lead Sam, structured demo pacing around 3s/5s/7s signal cycles, prepared the slide deck visual layout, and coordinated acoustic chime feedback during live demonstrations.

### 5. Mathematics, Proofs & Pedagogical Systems
👥 **Team Members:** **Joel Duke**, **Jose Alex**, & **Jyothika Prakash**
- **Joel Duke:** Researched linear congruences for traffic signal timing cycles. Formulated 3-intersection system equations for 3s, 5s, 7s cycles with non-zero remainder offsets, proved coprimality of moduli ($\gcd=1$), and computed modular inverses ($y_1=2, y_2=1, y_3=1$).
- **Jose Alex:** Verified mathematical proofs and uniqueness bounds modulo $M=105$. Conducted formal Extended Euclidean Algorithm inverse calculations, validated remainder offset equations against theoretical bounds, and analyzed boundary edge cases.
- **Jyothika Prakash:** Developed the pedagogical system, progressive 3-tier educational hint engine, and explanatory learning modules. Authored step-by-step documentation translating abstract modulo congruences $x \equiv a_i \pmod{m_i}$ into intuitive traffic light timing concepts.
