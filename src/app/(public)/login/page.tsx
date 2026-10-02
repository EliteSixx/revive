import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Sign in" };

// Phase 1 links each portal directly so the team can review the screens.
// Phase 2 replaces this list with real sign-in and role-based redirects.
const PORTAL_PREVIEWS = [
  { label: "Trainee", href: "/trainee" },
  { label: "Follow-up desk", href: "/agent" },
  { label: "Training provider", href: "/provider" },
  { label: "Employer", href: "/employer" },
  { label: "Government", href: "/gov" },
] as const;

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-10 lg:py-14">
      <h1 className="text-h1">Sign in to Revive</h1>

      <Tabs defaultValue="trainee" className="mt-6">
        <TabsList aria-label="Account type">
          <TabsTrigger value="trainee">Trainee</TabsTrigger>
          <TabsTrigger value="staff">Staff and employers</TabsTrigger>
        </TabsList>

        <TabsContent value="trainee">
          <form className="flex flex-col gap-5" noValidate>
            <Field
              id="trainee-phone"
              label="Mobile number"
              helperText="The number you gave at your training centre. We will send a one-time password."
            >
              <Input
                id="trainee-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                className="h-12"
                aria-describedby="trainee-phone-helper"
              />
            </Field>
            <Button size="lg">Send one-time password</Button>
          </form>
        </TabsContent>

        <TabsContent value="staff">
          <form className="flex flex-col gap-5" noValidate>
            <Field id="staff-email" label="Email address">
              <Input id="staff-email" type="email" autoComplete="username" />
            </Field>
            <Field id="staff-password" label="Password">
              <Input
                id="staff-password"
                type="password"
                autoComplete="current-password"
              />
            </Field>
            <Button>Sign in</Button>
            <p className="text-small text-fg-muted">
              New employer?{" "}
              <Link
                href="/employer/register"
                className="text-primary underline"
              >
                Register your business
              </Link>
            </p>
          </form>
        </TabsContent>
      </Tabs>

      <Card className="mt-10">
        <CardHeader
          title="Prototype preview"
          description="Sign-in is not connected yet. Open a portal directly to review its screens."
        />
        <CardBody className="p-0">
          <ul>
            {PORTAL_PREVIEWS.map((portal) => (
              <li
                key={portal.href}
                className="border-b border-border last:border-b-0"
              >
                <Link
                  href={portal.href}
                  className="flex items-center justify-between px-5 py-3 hover:bg-surface-muted"
                >
                  {portal.label}
                  <ChevronRight
                    className="size-4 text-fg-muted"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
