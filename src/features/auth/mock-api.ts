import { ActionError, simulateRequest } from "@/mocks/simulate-request";
import {
  DEMO_STAFF_ACCOUNTS,
  DEMO_STAFF_PASSWORD,
  DEMO_TRAINEE_ACCOUNTS,
  maskPhone,
  PORTAL_PATH_BY_ROLE,
} from "./demo-accounts";
import { pendingOtpStore, sessionStore, type Session } from "./session";

// Frontend-phase sign-in (architecture.md section 11). Phase 2 replaces each
// function with a server action of the same name, inputs and result.

export const OTP_LENGTH = 6;
export const OTP_RESEND_WAIT_SECONDS = 30;
const OTP_VALID_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 5;

export interface OtpRequestResult {
  maskedPhone: string;
  /** Shown on screen as a simulated SMS, because the prototype cannot send real ones. */
  simulatedSmsCode: string;
  validMinutes: number;
  resendAvailableAt: number;
}

function generateOtpCode(): string {
  const [randomValue] = crypto.getRandomValues(new Uint32Array(1));
  return String(randomValue % 10 ** OTP_LENGTH).padStart(OTP_LENGTH, "0");
}

function startSession(session: Omit<Session, "signedInAt">): Session {
  const started = { ...session, signedInAt: new Date().toISOString() };
  sessionStore.setState(() => started);
  return started;
}

export function requestOtp(phone: string) {
  return simulateRequest<OtpRequestResult>(() => {
    const account = DEMO_TRAINEE_ACCOUNTS.find((item) => item.phone === phone);
    if (!account) {
      throw new ActionError(
        "We could not find a trainee with this mobile number. Check the number, or ask your training centre to update it.",
      );
    }

    const now = Date.now();
    const pending = pendingOtpStore.getState();
    const resendAvailableAt =
      (pending?.sentAt ?? 0) + OTP_RESEND_WAIT_SECONDS * 1000;
    if (pending?.phone === phone && now < resendAvailableAt) {
      const secondsLeft = Math.ceil((resendAvailableAt - now) / 1000);
      throw new ActionError(
        `Please wait ${secondsLeft} seconds before asking for a new code.`,
      );
    }

    const code = generateOtpCode();
    pendingOtpStore.setState(() => ({
      phone,
      code,
      sentAt: now,
      expiresAt: now + OTP_VALID_MINUTES * 60 * 1000,
      attemptsLeft: OTP_MAX_ATTEMPTS,
    }));

    return {
      maskedPhone: maskPhone(phone),
      simulatedSmsCode: code,
      validMinutes: OTP_VALID_MINUTES,
      resendAvailableAt: now + OTP_RESEND_WAIT_SECONDS * 1000,
    };
  });
}

export function verifyOtp(phone: string, code: string) {
  return simulateRequest<Session>(() => {
    const pending = pendingOtpStore.getState();
    if (!pending || pending.phone !== phone) {
      throw new ActionError("Request a new code to continue.");
    }
    if (Date.now() > pending.expiresAt) {
      throw new ActionError("This code has expired. Request a new code.");
    }
    if (pending.attemptsLeft <= 0) {
      throw new ActionError("Too many wrong codes. Request a new code.");
    }
    if (pending.code !== code) {
      const attemptsLeft = pending.attemptsLeft - 1;
      pendingOtpStore.setState(() => ({ ...pending, attemptsLeft }));
      throw new ActionError(
        attemptsLeft === 0
          ? "Too many wrong codes. Request a new code."
          : `That code is not right. You have ${attemptsLeft} ${attemptsLeft === 1 ? "try" : "tries"} left.`,
      );
    }

    const account = DEMO_TRAINEE_ACCOUNTS.find((item) => item.phone === phone);
    if (!account) throw new ActionError("Request a new code to continue.");

    pendingOtpStore.setState(() => null);
    return startSession({
      role: "TRAINEE",
      displayName: account.displayName,
      portalPath: PORTAL_PATH_BY_ROLE.TRAINEE,
      districtCode: null,
    });
  });
}

export function signInStaff(email: string, password: string) {
  return simulateRequest<Session>(() => {
    const account = DEMO_STAFF_ACCOUNTS.find(
      (item) => item.email === email.trim().toLowerCase(),
    );
    // One message for both cases, so the form does not reveal which emails exist.
    if (!account || password !== DEMO_STAFF_PASSWORD) {
      throw new ActionError(
        "The email address or password is not right. Check them and try again.",
      );
    }
    return startSession({
      role: account.role,
      displayName: account.displayName,
      portalPath: PORTAL_PATH_BY_ROLE[account.role],
      districtCode: account.districtCode,
    });
  });
}

export function signOut() {
  return simulateRequest(() => {
    sessionStore.setState(() => null);
    pendingOtpStore.setState(() => null);
  });
}
