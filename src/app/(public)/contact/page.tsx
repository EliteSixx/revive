import { LongFormPage } from "@/components/layout/long-form";

export const metadata = { title: "Contact" };

// TODO(copy): add the team's contact email and, for a live deployment, the operating
// department's grievance officer. Both are needed before launch.
export default function ContactPage() {
  return (
    <LongFormPage title="Contact">
      <p>
        Revive is a prototype built by a student team for Smart India Hackathon
        2026 (Problem Statement 26135). It is not an official Government of
        Maharashtra website.
      </p>

      <h2>Questions about the prototype</h2>
      <p>The team&apos;s contact details will be added here before launch.</p>

      <h2>Personal data and grievances</h2>
      <p>
        In a live deployment, the operating department would publish the name
        and contact details of its grievance officer here. Trainees could use
        them to ask about their data, correct it, withdraw consent or raise a
        complaint.
      </p>

      <h2>If you are a trainee</h2>
      <p>
        For questions about your course or certificate, contact your training
        centre. For questions about follow-ups or consent, sign in and use the
        Consent page.
      </p>
    </LongFormPage>
  );
}
