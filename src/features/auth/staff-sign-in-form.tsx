"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { describedBy, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInStaff } from "./mock-api";
import { staffSignInSchema, type StaffSignInValues } from "./schemas";
import { useCompleteSignIn } from "./use-complete-sign-in";

interface StaffSignInFormProps {
  initialValues: StaffSignInValues;
  /** True when the form was just filled from a prototype account. */
  shouldFocusOnMount: boolean;
}

/**
 * Email and password sign-in for desk agents, providers, employers and officials.
 * The parent remounts this form (with a new key) when a prototype account fills it.
 */
export function StaffSignInForm({
  initialValues,
  shouldFocusOnMount,
}: StaffSignInFormProps) {
  const completeSignIn = useCompleteSignIn();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffSignInValues>({
    resolver: zodResolver(staffSignInSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    // A filled form only needs the Sign in button, so that is where focus goes.
    if (shouldFocusOnMount) submitButtonRef.current?.focus();
  }, [shouldFocusOnMount]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    const result = await signInStaff(email, password);
    if (!result.ok) {
      setError("password", { message: result.error }, { shouldFocus: true });
      return;
    }
    completeSignIn(result.data);
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      <Field id="staff-email" label="Email address" errorText={emailError}>
        <Input
          id="staff-email"
          type="email"
          autoComplete="username"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={describedBy(
            "staff-email",
            false,
            Boolean(emailError),
          )}
          {...register("email")}
        />
      </Field>

      <Field id="staff-password" label="Password" errorText={passwordError}>
        <div className="relative">
          <Input
            id="staff-password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            className="pr-11"
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={describedBy(
              "staff-password",
              false,
              Boolean(passwordError),
            )}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-sm p-2 text-fg-muted hover:bg-surface-muted hover:text-fg"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            {isPasswordVisible ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </Field>

      <Button ref={submitButtonRef} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in" : "Sign in"}
      </Button>

      <div className="flex flex-col gap-1 text-small text-fg-muted">
        <p>
          Forgot your password? Ask the administrator of your organisation to
          reset it.
        </p>
        <p>
          New employer?{" "}
          <Link href="/employer/register" className="text-primary underline">
            Register your business
          </Link>
        </p>
      </div>
    </form>
  );
}
