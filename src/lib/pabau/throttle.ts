import "server-only";
import { PabauCircuitOpenError } from "./types";

const MIN_SPACING_MS = 2500;
const CIRCUIT_OPEN_DURATION_MS = 5 * 60 * 1000;

let lastCallAt = 0;
let inflight: Promise<void> = Promise.resolve();
let circuitReopenAt = 0;

export function isCircuitOpen(): boolean {
  return Date.now() < circuitReopenAt;
}

export function tripCircuit(): void {
  circuitReopenAt = Date.now() + CIRCUIT_OPEN_DURATION_MS;
}

export function resetCircuit(): void {
  circuitReopenAt = 0;
}

export function getCircuitStatus(): { open: boolean; reopenAt: number } {
  return { open: isCircuitOpen(), reopenAt: circuitReopenAt };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function throttle(): Promise<void> {
  if (isCircuitOpen()) {
    throw new PabauCircuitOpenError(circuitReopenAt);
  }
  const release = inflight;
  let resolveSelf!: () => void;
  inflight = new Promise<void>((r) => (resolveSelf = r));
  try {
    await release;
    const elapsed = Date.now() - lastCallAt;
    const wait = MIN_SPACING_MS - elapsed;
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();
  } finally {
    resolveSelf();
  }
}
