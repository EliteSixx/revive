import Link from "next/link";
import { LongFormPage } from "@/components/layout/long-form";

export const metadata = { title: "Terms and conditions" };

// TODO(copy): legal review of these terms is a launch blocker (rules.md, section B).
export default function TermsPage() {
  return (
    <LongFormPage title="Terms and conditions" meta="Last updated 4 Oct 2026">
      <h2>About Revive</h2>
      <p>
        Revive records what happens to trainees after skilling courses, so that
        trainees, training providers, employers and government departments can
        see verified outcomes.
      </p>

      <h2>Using Revive</h2>
      <ul>
        <li>
          Use Revive only for its intended purpose: recording and reviewing
          training outcomes.
        </li>
        <li>
          Keep your sign-in details private. You are responsible for activity
          under your account.
        </li>
        <li>
          Do not try to access data you are not allowed to see, or to disrupt
          the service.
        </li>
      </ul>

      <h2>Accuracy of information</h2>
      <ul>
        <li>
          Trainees should report their situation truthfully and update it when
          it changes.
        </li>
        <li>
          Training providers must only report placements they can support with
          evidence when asked.
        </li>
        <li>Employers must only confirm employment that is true.</li>
      </ul>
      <p>
        Knowingly submitting false information may lead to the account being
        suspended and to action under the rules of the relevant programme.
      </p>

      <h2>Personal data</h2>
      <p>
        How personal data is collected and used is explained in the{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Availability</h2>
      <p>
        Revive is provided without any guarantee of availability or fitness for
        a particular purpose. Pages marked as using sample data show figures
        that are not real results; do not use them for funding or legal
        decisions.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may change. The date at the top of this page shows when they
        were last updated.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LongFormPage>
  );
}
