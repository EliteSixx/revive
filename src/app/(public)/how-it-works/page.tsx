import { LongFormPage } from "@/components/layout/long-form";
import {
  CONSENT_PURPOSES,
  FOLLOW_UP_WINDOWS,
  OUTCOME_TYPE_LABELS,
  VERIFICATION_LEVEL_LABELS,
  VERIFICATION_LEVELS,
} from "@/lib/constants";

export const metadata = { title: "How it works" };

const VERIFICATION_DESCRIPTIONS: Record<
  (typeof VERIFICATION_LEVELS)[number],
  string
> = {
  EPFO_VERIFIED: "Matched against EPFO records, with the trainee's consent.",
  EMPLOYER_CONFIRMED: "The employer confirmed the job in Revive.",
  EVIDENCE_ATTACHED:
    "An offer letter, payslip or similar document was uploaded and reviewed.",
  PROVIDER_REPORTED: "Reported by the training provider.",
  SELF_REPORTED: "Reported only by the trainee.",
};

export default function HowItWorksPage() {
  return (
    <LongFormPage title="How it works">
      <p>
        Revive records what trainees do after a skilling course: whether they
        find a job, start their own work, join an apprenticeship, keep studying
        or are still looking. It asks at fixed times, keeps each answer with its
        source, and shows how much of every figure has been verified.
      </p>

      <h2>When we ask</h2>
      <p>Follow-ups are counted from the date of certification.</p>
      <div className="mt-4 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-body">
          <caption className="sr-only">Follow-up schedule</caption>
          <thead className="bg-surface-muted">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-label text-fg-muted">
                Follow-up
              </th>
              <th scope="col" className="px-4 py-2.5 text-label text-fg-muted">
                Timing
              </th>
              <th scope="col" className="px-4 py-2.5 text-label text-fg-muted">
                What it covers
              </th>
            </tr>
          </thead>
          <tbody>
            {FOLLOW_UP_WINDOWS.map((item) => (
              <tr key={item.window} className="border-t border-border">
                <td className="px-4 py-2.5 font-medium">{item.window}</td>
                <td className="px-4 py-2.5">
                  {item.monthsAfterCertification === 0
                    ? "At certification"
                    : `${item.monthsAfterCertification} months after`}
                  {item.isOptional && " (optional)"}
                </td>
                <td className="px-4 py-2.5">{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How we reach trainees</h2>
      <ol>
        <li>An SMS or WhatsApp message with a link to a short form.</li>
        <li>A reminder after 3 days.</li>
        <li>An automated phone call after 7 days.</li>
        <li>A call from a follow-up desk agent after 10 days.</li>
        <li>The alternate number, only if the trainee agreed to it.</li>
      </ol>
      <p>
        Each follow-up stays open for 30 days. A form has at most six questions
        and takes under two minutes.
      </p>

      <h2>What we ask about</h2>
      <ul>
        {Object.values(OUTCOME_TYPE_LABELS).map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <p>
        If a trainee is not working, we ask why, from a fixed list of reasons.
        If they left a job, we ask why they left. These answers show where
        courses and placements need to change.
      </p>

      <h2>How outcomes are verified</h2>
      <p>
        Every outcome carries one of these levels, listed from strongest to
        weakest.
      </p>
      <ul>
        {VERIFICATION_LEVELS.map((level) => (
          <li key={level}>
            <strong className="font-semibold">
              {VERIFICATION_LEVEL_LABELS[level]}.
            </strong>{" "}
            {VERIFICATION_DESCRIPTIONS[level]}
          </li>
        ))}
      </ul>
      <p>
        The main accountability figure, the verified placement rate, counts only
        employer-confirmed and EPFO-verified outcomes.
      </p>

      <h2>What trainees agree to</h2>
      <ul>
        {CONSENT_PURPOSES.map((item) => (
          <li key={item.purpose}>
            <strong className="font-semibold">{item.title}</strong>
            {item.isRequired ? " (required to take part)" : " (optional)"}.{" "}
            {item.description}
          </li>
        ))}
      </ul>
    </LongFormPage>
  );
}
