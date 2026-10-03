"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { DemoAccountsPanel } from "./demo-accounts-panel";
import { DEMO_STAFF_PASSWORD } from "./demo-accounts";
import { signOut } from "./mock-api";
import { useSession } from "./session";
import { StaffSignInForm } from "./staff-sign-in-form";
import { TraineeSignInForm } from "./trainee-sign-in-form";

type AccountTab = "trainee" | "staff";

interface FormFill {
  /** Increases on every fill, used as the form key so the form starts fresh. */
  id: number;
  /** The form that was filled, which then receives focus. */
  target: AccountTab | null;
  phone: string;
  email: string;
  password: string;
}

const EMPTY_FILL: FormFill = {
  id: 0,
  target: null,
  phone: "",
  email: "",
  password: "",
};

export function SignInView() {
  const session = useSession();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AccountTab>("trainee");
  const [fill, setFill] = useState<FormFill>(EMPTY_FILL);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);
    showToast(
      result.ok ? "success" : "error",
      result.ok ? "You have signed out." : result.error,
    );
  }

  return (
    <>
      {session && (
        <div
          role="status"
          className="mt-6 rounded-md border border-success/30 bg-success-subtle p-4"
        >
          <p>
            You are signed in as{" "}
            <span className="font-medium">{session.displayName}</span>.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href={session.portalPath}>Continue to your portal</Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AccountTab)}
        className="mt-6"
      >
        <TabsList aria-label="Account type">
          <TabsTrigger value="trainee">Trainee</TabsTrigger>
          <TabsTrigger value="staff">Staff and employers</TabsTrigger>
        </TabsList>

        {/* Both forms stay mounted so switching tabs keeps what was typed. */}
        <TabsContent
          value="trainee"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <TraineeSignInForm
            key={`trainee-${fill.id}`}
            initialPhone={fill.phone}
            shouldFocusOnMount={fill.target === "trainee"}
          />
        </TabsContent>

        <TabsContent
          value="staff"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <StaffSignInForm
            key={`staff-${fill.id}`}
            initialValues={{ email: fill.email, password: fill.password }}
            shouldFocusOnMount={fill.target === "staff"}
          />
        </TabsContent>
      </Tabs>

      <DemoAccountsPanel
        onChooseTrainee={(account) => {
          setFill({
            ...EMPTY_FILL,
            id: fill.id + 1,
            target: "trainee",
            phone: account.phone,
          });
          setActiveTab("trainee");
        }}
        onChooseStaff={(account) => {
          setFill({
            ...EMPTY_FILL,
            id: fill.id + 1,
            target: "staff",
            email: account.email,
            password: DEMO_STAFF_PASSWORD,
          });
          setActiveTab("staff");
        }}
      />
    </>
  );
}
