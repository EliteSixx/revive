import Link from "next/link";
import { LongFormPage } from "@/components/layout/long-form";

export const metadata = { title: "Contact" };

// TODO(copy): add the grievance officer's name, email and postal address for the
// department that operates Revive. Needed before launch (prd.md section 9).
export default function ContactPage() {
  return (
    <LongFormPage title="Contact">
      <p>Find the right place for your question below.</p>

      <h2>Trainees</h2>
      <ul>
        <li>
          For questions about your course, batch or certificate, contact your
          training centre.
        </li>
        <li>
          To change your mobile number, update your work details or manage
          consent, <Link href="/login">sign in</Link> and use your Profile or
          Consent page.
        </li>
      </ul>

      <h2>Training providers and employers</h2>
      <ul>
        <li>
          For help signing in or with your account, contact the administrator of
          your organisation.
        </li>
        <li>
          If your business is not registered yet,{" "}
          <Link href="/employer/register">register your business</Link>.
        </li>
      </ul>

      <h2>Personal data and grievances</h2>
      <p>
        You can see your data, correct it and withdraw consent from your own
        account. For anything you cannot do yourself, or to raise a complaint
        about how your data is used, contact the grievance officer of the
        department that operates Revive. Read the{" "}
        <Link href="/privacy">privacy policy</Link> for your rights.
      </p>

      <h2>Accessibility problems</h2>
      <p>
        If any part of Revive is hard to use, contact the grievance officer.
        Describe the page and what went wrong. The{" "}
        <Link href="/accessibility">accessibility statement</Link> explains the
        standards Revive follows.
      </p>
    </LongFormPage>
  );
}
