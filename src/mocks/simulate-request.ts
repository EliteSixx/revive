// Gives mock actions the same shape as the real requests that replace them in
// Phase 2: async, with a short delay (so loading states get built) and a result
// object instead of a thrown error.

export type ActionResult<Data = void> =
  { ok: true; data: Data } | { ok: false; error: string };

/**
 * An error whose message is safe to show to the user. Write it as design.md
 * section 8 asks: what went wrong and how to fix it, e.g. "Enter a 10-digit mobile number".
 */
export class ActionError extends Error {}

const SIMULATED_DELAY_MS = 400;
const UNEXPECTED_ERROR_MESSAGE = "Something went wrong. Please try again.";

export async function simulateRequest<Data>(
  run: () => Data,
): Promise<ActionResult<Data>> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
  try {
    return { ok: true, data: run() };
  } catch (error) {
    if (error instanceof ActionError)
      return { ok: false, error: error.message };
    console.error(error);
    return { ok: false, error: UNEXPECTED_ERROR_MESSAGE };
  }
}
