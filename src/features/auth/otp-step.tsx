"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { describedBy, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  OTP_LENGTH,
  requestOtp,
  verifyOtp,
  type OtpRequestResult,
} from "./mock-api";
import { otpSchema, type OtpValues } from "./schemas";
import { useCompleteSignIn } from "./use-complete-sign-in";

interface OtpStepProps {
  phone: string;
  request: OtpRequestResult;
  onResent: (request: OtpRequestResult) => void;
  onChangeNumber: () => void;
}

export function OtpStep({
  phone,
  request,
  onResent,
  onChangeNumber,
}: OtpStepProps) {
  const completeSignIn = useCompleteSignIn();
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const secondsUntilResend = useSecondsUntil(request.resendAvailableAt);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    setFocus("code");
  }, [request, setFocus]);

  const onSubmit = handleSubmit(async ({ code }) => {
    const result = await verifyOtp(phone, code);
    if (!result.ok) {
      setError("code", { message: result.error }, { shouldFocus: true });
      return;
    }
    completeSignIn(result.data);
  });

  async function handleResend() {
    setIsResending(true);
    const result = await requestOtp(phone);
    setIsResending(false);
    if (!result.ok) {
      showToast("error", result.error);
      return;
    }
    reset({ code: "" });
    onResent(result.data);
    showToast("success", `A new code was sent to ${result.data.maskedPhone}.`);
  }

  const errorText = errors.code?.message;
  const isBusy = isSubmitting || isResending;

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      <p>
        Enter the {OTP_LENGTH}-digit code sent to{" "}
        <span className="font-medium tabular-nums">{request.maskedPhone}</span>.
      </p>

      <div
        role="note"
        aria-label="Simulated SMS"
        className="rounded-md border border-primary/20 bg-info-subtle p-4"
      >
        <p className="flex items-center gap-2 text-label text-primary">
          <MessageSquare className="size-4" aria-hidden="true" />
          Simulated SMS (prototype only)
        </p>
        <p className="mt-1">
          Your Revive sign-in code is{" "}
          <span className="font-semibold tracking-wider tabular-nums">
            {request.simulatedSmsCode}
          </span>
          . It is valid for {request.validMinutes} minutes. Do not share it with
          anyone.
        </p>
      </div>

      <Field id="trainee-otp" label="One-time password" errorText={errorText}>
        <Input
          id="trainee-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={OTP_LENGTH}
          className="h-12 tracking-widest tabular-nums"
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy(
            "trainee-otp",
            false,
            Boolean(errorText),
          )}
          {...register("code")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isBusy}>
        {isSubmitting ? "Checking code" : "Verify and sign in"}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangeNumber}
          disabled={isBusy}
        >
          Change number
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isBusy || secondsUntilResend > 0}
        >
          {secondsUntilResend > 0
            ? `Resend code in ${secondsUntilResend} s`
            : "Resend code"}
        </Button>
      </div>
    </form>
  );
}

/** Whole seconds left until a timestamp, updated every second. */
function useSecondsUntil(timestamp: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [timestamp]);

  return Math.max(0, Math.ceil((timestamp - now) / 1000));
}
