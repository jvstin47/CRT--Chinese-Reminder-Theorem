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

/** Solves x ≡ remainders[i] (mod moduli[i]) for pairwise-coprime moduli, returns smallest non-negative x. */
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
