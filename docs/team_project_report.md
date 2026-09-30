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
- **Justin Joe Mathew (Team Lead):** Guided overall project direction, engineered core system architecture, and led the construction and logic of the working traffic signal model.
- **Jyothis Liju:** Assisted Justin directly in constructing the working traffic signal model, testing signal synchronization alignment, and verifying physical component interaction.

### 2. Hardware Sourcing, Build Testing & Application Design
👥 **Team Members:** **Joseph Alex** & **Joseph J**
- **Joseph Alex:** Determined component requirements, purchased hardware parts, executed physical build testing, and contributed to application use-cases.
- **Joseph J:** Handled hardware part selection, procurement, mechanism assembly testing, and co-developed application integration ideas.

### 3. Web Design & Frontend Development
👥 **Team Members:** **Johan Geo** & **Johaan Sam**
- **Johan Geo:** Designed the user interface, visual layout, traffic signal dashboard theme, and interactive monitor dials.
- **Johaan Sam:** Built the frontend components, state integration, responsive layouts, and interactive controls.

### 4. Presentation & Demo Lead
👥 **Team Member:** **Joel Geo Manuel**
- **Joel Geo Manuel:** Handled the presentation structure, demo walkthrough flow, visual slides, and showcase delivery for explaining the project to an audience.

### 5. Mathematics & CRT Applications Research
👥 **Team Members:** **Joel Duke**, **Jyothika Prakash**, & **Jose Alex**
- **Joel Duke:** Researched linear congruences and formulated the traffic signal synchronization modulo equations ($3, 5, 7$ minute cycles).
- **Jyothika Prakash:** Explored real-world CRT applications and authored step-by-step mathematical explanations and hint structures.
- **Jose Alex:** Investigated Chinese Remainder Theorem proofs, solution bounds ($N = 105$), and modulo remainder properties.
