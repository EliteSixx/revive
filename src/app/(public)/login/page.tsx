import { SignInView } from "@/features/auth/sign-in-view";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-10 lg:py-14">
      <h1 className="text-h1">Sign in to Revive</h1>
      <p className="mt-2 text-fg-muted">
        Trainees sign in with their mobile number. Staff, employers and
        officials sign in with their work email.
      </p>
      <SignInView />
    </div>
  );
}
