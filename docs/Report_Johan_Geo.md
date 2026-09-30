# MATHEMATICS PROJECT ASSIGNMENT REPORT

**PROJECT TITLE:** Traffic Signal Synchronization System Using Chinese Remainder Theorem  
**COURSE:** Number Theory & Discrete Mathematics Application  
**CLASS:** S3 CSE B  
**STUDENT NAME:** Johan Geo  
**ROLL NO:** 54  
**ROLE / FUNCTION:** Web Design & UI Architect  

---

## 1. ABSTRACT
The Chinese Remainder Theorem (CRT) is a fundamental result in number theory that determines a unique integer solution x for a system of linear congruences with pairwise coprime moduli. While often taught abstractly, CRT has direct applications in urban traffic signal synchronization, digital telecommunications, and parallel computer architectures.

This project demonstrates CRT using both a physical working traffic signal model and an interactive digital web application. By modeling traffic signals as modular timing cycles, the project illustrates how independent light timers (3 min, 5 min, 7 min) align to create a continuous 'Green Wave' for vehicles at Minute 23.

---

## 2. INTRODUCTION & OBJECTIVES
When traffic signals operate on independent timer cycles along a main avenue, drivers frequently encounter red lights. Traffic engineers solve this by calculating when all signals will simultaneously show green.

### Project Objectives:
1. To understand the mathematical principles of the Chinese Remainder Theorem (CRT).
2. To differentiate between Least Common Multiple (LCM) and CRT when remainder offsets are present.
3. To model traffic signal timing cycles (3 min, 5 min, 7 min) as modular congruences.
4. To build a physical working model and an interactive web simulator for signal synchronization.
5. To provide clear visual and audio feedback when a candidate time satisfies all signal modulo conditions.

---

## 3. MATHEMATICAL FORMULATION (CRT vs. LCM)

### 3.1 The Traffic Signal Equations
Suppose three traffic signals have cycle lengths of 3, 5, and 7 minutes respectively:
- Signal 1: x ≡ 2 (mod 3)   (green 2 minutes ago)
- Signal 2: x ≡ 3 (mod 5)   (green 3 minutes ago)
- Signal 3: x ≡ 2 (mod 7)   (green 2 minutes ago)

### 3.2 Why Simple LCM Cannot Solve This Problem
- LCM: Used only when all signals start at Minute 0 with zero remainder offset (x ≡ 0).
- CRT: Required when remainder offsets (2, 3, 2) are distinct and non-zero.

### 3.3 CRT Solution Procedure
1. Total Product: M = 3 × 5 × 7 = 105.
2. Partial Products: M1 = 35, M2 = 21, M3 = 15.
3. Modular Inverses:
   • 35 * y1 ≡ 1 (mod 3) ⇒ 2 * y1 ≡ 1 (mod 3) ⇒ y1 = 2
   • 21 * y2 ≡ 1 (mod 5) ⇒ 1 * y2 ≡ 1 (mod 5) ⇒ y2 = 1
   • 15 * y3 ≡ 1 (mod 7) ⇒ 1 * y3 ≡ 1 (mod 7) ⇒ y3 = 1
4. Compute x:
   • x = (2 × 35 × 2) + (3 × 21 × 1) + (2 × 15 × 1)
   • x = 140 + 63 + 30 = 233
   • x ≡ 233 (mod 105) ≡ 23 (mod 105)

The unique green-wave solution within [0, 104] is Minute 23.

---

## 4. DIGITAL IMPLEMENTATION & USER CONTROLS

The web application models the traffic signal system digitally using React, TypeScript, and Framer Motion.

![Traffic Light Sync Diagram](/Users/justin/.gemini/antigravity/brain/e7c94d9d-c35b-4a53-a23b-c1f6d686fdc4/traffic_light_diagram_1790783447873.jpg)

![Traffic Signal Synchronizer Web UI](/Users/justin/.gemini/antigravity/brain/e7c94d9d-c35b-4a53-a23b-c1f6d686fdc4/traffic_signal_app_ui_1790783779368.jpg)

### Interactive User Controls:
1. Candidate Timer Wheel: Adjusts the candidate time value x (e.g. set to 23).
2. Intersection Signal Monitors (3 min, 5 min, 7 min): Shows real-time remainder values (x mod mi) and green light indicator status.
3. 'Evaluate Synchronization' Button: Tests whether all 3 intersections display green lights simultaneously.
4. Green-Wave Status Panel: Displays full green-wave confirmation when all 3 congruences are satisfied (x = 23).

---

## 5. SOURCE CODE IMPLEMENTATION (ALGORITHM PAGE)

The following complete TypeScript module (src/utils/crt.ts) implements the Extended Euclidean Algorithm and Modular Inverses to solve the CRT system:

```typescript
export function getRemainder(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function extendedGcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = extendedGcd(b, a % b);
  return [g, y1, x1 - Math.floor(a / b) * y1];
}

function modInverse(a: number, m: number): number {
  const [, x] = extendedGcd(getRemainder(a, m), m);
  return getRemainder(x, m);
}

/** Solves x ≡ remainders[i] (mod moduli[i]) for pairwise-coprime moduli */
export function solveCRT(moduli: number[], remainders: number[]): number {
  const product = moduli.reduce((acc, m) => acc * m, 1);
  let result = 0;
  for (let i = 0; i < moduli.length; i++) {
    const mi = moduli[i];
    const ri = getRemainder(remainders[i], mi);
    const partial = product / mi;
    const inverse = modInverse(partial, mi);
    result += ri * partial * inverse;
  }
  return getRemainder(result, product);
}

export function checkRemainders(x: number, moduli: number[], remainders: number[]): boolean[] {
  return moduli.map((m, i) => getRemainder(x, m) === getRemainder(remainders[i], m));
}
```

---

## 6. CONCLUSION
The Traffic Signal Synchronization System provides an intuitive, practical bridge between abstract number theory and urban infrastructure engineering. By applying the Chinese Remainder Theorem to traffic signals operating on independent cycles (3 min, 5 min, 7 min), the project demonstrates how non-zero remainder offsets determine the exact minute (Minute 23) required to establish a continuous 'Green Wave' for vehicles.

Both the physical working model and the interactive web application successfully visualize modular congruences, offering an accessible learning tool that highlights the real-world power of modular arithmetic in signal timing, telecommunications, and digital computing.

---

## 7. INDIVIDUAL CONTRIBUTION

**Name:** Johan Geo  
**Class:** S3 CSE B  
**Roll No:** 54  
**Role:** Web Design & UI Architect  

### Contribution Summary:
I designed the website interface, visual layout, and traffic signal dashboard theme. I created the interactive modular dial components and responsive styling using Tailwind CSS, ensuring clear visual feedback for remainder checkmarks and signal light states.
