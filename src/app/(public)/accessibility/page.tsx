import Link from "next/link";
import { LongFormPage } from "@/components/layout/long-form";

export const metadata = { title: "Accessibility statement" };

export default function AccessibilityPage() {
  return (
    <LongFormPage
      title="Accessibility statement"
      meta="Last updated 3 Oct 2026"
    >
      <p>
        Revive is built so that trainees, staff and officials can use it
        regardless of ability or device.
      </p>

      <h2>What we aim for</h2>
      <ul>
        <li>Conformance with WCAG 2.1 level AA.</li>
        <li>The Guidelines for Indian Government Websites (GIGW 3.0).</li>
        <li>
          Every action can be done with a keyboard alone, with a visible focus
          outline.
        </li>
        <li>
          Every form field has a visible label, and errors explain how to fix
          them.
        </li>
        <li>Colour is never the only way information is shown.</li>
        <li>Every chart can be switched to a table.</li>
        <li>
          Trainee pages work on small phone screens, from 360 pixels wide.
        </li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>
          Revive is available in English only. Marathi and Hindi are planned.
        </li>
        <li>
          Revive has not yet been tested by an independent accessibility
          auditor.
        </li>
      </ul>

      <h2>Report a problem</h2>
      <p>
        If something in Revive is hard to use, please tell us through the{" "}
        <Link href="/contact">contact page</Link>. Describe the page and what
        went wrong.
      </p>
    </LongFormPage>
  );
}
