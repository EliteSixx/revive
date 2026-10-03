"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { describedBy, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestOtp, type OtpRequestResult } from "./mock-api";
import { OtpStep } from "./otp-step";
import { phoneSchema, type PhoneValues } from "./schemas";

interface TraineeSignInFormProps {
  initialPhone: string;
  /** True when the form was just filled from a prototype account. */
  shouldFocusOnMount: boolean;
}

interface SentOtp {
  phone: string;
  request: OtpRequestResult;
}

/**
 * Trainee sign-in: mobile number first, then the one-time password. The parent
 * remounts this form (with a new key) when a prototype account fills it.
 */
export function TraineeSignInForm({
  initialPhone,
  shouldFocusOnMount,
}: TraineeSignInFormProps) {
  const [sentOtp, setSentOtp] = useState<SentOtp | null>(null);
  const [phone, setPhone] = useState(initialPhone);
  const [hasChangedNumber, setHasChangedNumber] = useState(false);

  if (sentOtp) {
    return (
      <OtpStep
        phone={sentOtp.phone}
        request={sentOtp.request}
        onResent={(request) => setSentOtp({ phone: sentOtp.phone, request })}
        onChangeNumber={() => {
          setSentOtp(null);
          setHasChangedNumber(true);
        }}
      />
    );
  }

  return (
    <PhoneStep
      defaultPhone={phone}
      shouldFocusOnMount={shouldFocusOnMount || hasChangedNumber}
      onSent={(sentPhone, request) => {
        setPhone(sentPhone);
        setSentOtp({ phone: sentPhone, request });
      }}
    />
  );
}

interface PhoneStepProps {
  defaultPhone: string;
  shouldFocusOnMount: boolean;
  onSent: (phone: string, request: OtpRequestResult) => void;
}

function PhoneStep({
  defaultPhone,
  shouldFocusOnMount,
  onSent,
}: PhoneStepProps) {
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: defaultPhone },
  });

  useEffect(() => {
    if (shouldFocusOnMount) setFocus("phone");
  }, [shouldFocusOnMount, setFocus]);

  const onSubmit = handleSubmit(async (values) => {
    const result = await requestOtp(values.phone);
    if (!result.ok) {
      setError("phone", { message: result.error }, { shouldFocus: true });
      return;
    }
    onSent(values.phone, result.data);
  });

  const errorText = errors.phone?.message;

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      <Field
        id="trainee-phone"
        label="Mobile number"
        helperText="The number you gave at your training centre. We will send a one-time password to it."
        errorText={errorText}
      >
        <Input
          id="trainee-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          className="h-12"
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy(
            "trainee-phone",
            true,
            Boolean(errorText),
          )}
          {...register("phone")}
        />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending code" : "Send one-time password"}
      </Button>
    </form>
  );
}
