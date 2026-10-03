import Link from "next/link";
import { LongFormPage } from "@/components/layout/long-form";
import { CONSENT_PURPOSES } from "@/lib/constants";

export const metadata = { title: "Privacy policy" };

// TODO(copy): legal review of this policy is a launch blocker (rules.md, section B).
export default function PrivacyPage() {
  return (
    <LongFormPage title="Privacy policy" meta="Last updated 4 Oct 2026">
      <h2>About this policy</h2>
      <p>
        Revive is a system for tracking what happens to trainees after skilling
        courses. This policy explains what personal data Revive collects, why,
        who can see it, how long it is kept and what rights you have. It is
        written to follow the Digital Personal Data Protection Act, 2023 and the
        rules made under it.
      </p>
      <p>
        The department that operates Revive is the data fiduciary responsible
        for your data. How to reach its grievance officer is explained on the{" "}
        <Link href="/contact">contact page</Link>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Identity details: name, date of birth, gender, district.</li>
        <li>
          Optional details used only for combined reports: social category,
          disability status, rural or urban residence.
        </li>
        <li>
          Contact details: mobile number, an alternate number if you give one,
          email if you give one.
        </li>
        <li>
          Training details: course, training centre, batch dates, certification
          date.
        </li>
        <li>
          Outcome details: your work situation, employer name, job role, start
          and end dates, monthly wage, reasons for not working or leaving a job,
          and how useful the training was.
        </li>
        <li>
          Documents you choose to upload, such as an offer letter or payslip.
        </li>
        <li>Your UAN, only if you agree to EPFO verification.</li>
      </ul>
      <p>We do not collect or store Aadhaar numbers.</p>

      <h2>Why we use it</h2>
      <p>
        We use your data only for the purposes you agree to. You agree to each
        purpose separately.
      </p>
      <ul>
        {CONSENT_PURPOSES.map((item) => (
          <li key={item.purpose}>
            <strong className="font-semibold">{item.title}</strong>
            {item.isRequired ? " (required to take part)" : " (optional)"}.{" "}
            {item.description}
          </li>
        ))}
      </ul>

      <h2>Who can see your data</h2>
      <ul>
        <li>You can see your full record in your trainee account.</li>
        <li>Your training provider can see outcomes for its own trainees.</li>
        <li>
          An employer sees only your name, job role and start date, and only if
          you agreed to employer verification and named that employer.
        </li>
        <li>
          Follow-up desk staff see your name and number only while a follow-up
          with you is open.
        </li>
        <li>
          Government officials see combined figures. A district officer sees
          only their own district. Any figure based on fewer than 10 trainees is
          hidden.
        </li>
      </ul>
      <p>
        Every time staff open a trainee record, it is written to an audit log.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Outcome data is kept for the tracking period of your programme and for a
        fixed period after it for reporting. The exact period will be set by the
        operating department and published here before launch. When the period
        ends, personal details are deleted and only figures that cannot identify
        you are kept.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>See a summary of your data and how it is used.</li>
        <li>Correct data that is wrong or incomplete.</li>
        <li>
          Withdraw consent for any purpose. This is as easy as giving it, from
          the Consent page.
        </li>
        <li>
          Ask for your data to be erased when it is no longer needed for the
          purpose you agreed to.
        </li>
        <li>
          Nominate another person to use these rights if you are unable to.
        </li>
        <li>Raise a grievance and get a response.</li>
      </ul>
      <p>
        Withdrawing consent stops the related processing from that point. It
        does not undo processing that happened before.
      </p>

      <h2>Trainees under 18</h2>
      <p>
        If a trainee is under 18, consent must be given by a parent or lawful
        guardian, and their data is not used for any purpose beyond outcome
        tracking and combined reporting.
      </p>

      <h2>Security</h2>
      <p>
        Mobile numbers are stored encrypted. Access is limited by role and
        district. All connections use HTTPS. Personal details are never placed
        in web addresses.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change what we collect or why, we will show you the new notice and
        ask for consent again where the law requires it.
      </p>
    </LongFormPage>
  );
}
