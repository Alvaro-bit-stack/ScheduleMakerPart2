import type { Metadata } from "next";
import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — CalSnap",
  description: "Terms governing use of the CalSnap schedule conversion service.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      introduction="These terms govern your use of CalSnap and its Google Calendar integration."
    >
      <TermsSection title="The service">
        <p>
          CalSnap converts a schedule image into proposed recurring class
          events and submits those events to a Google Calendar you own after
          you authorize the requested permission.
        </p>
      </TermsSection>

      <TermsSection title="Your responsibilities">
        <ul>
          <li>Only upload images you have the right to process.</li>
          <li>
            Review the resulting Google Calendar events for accuracy, including
            dates, meeting days, times, recurrence, and locations.
          </li>
          <li>
            Do not use CalSnap to abuse Google APIs, consume services
            fraudulently, or create unlawful or misleading calendar content.
          </li>
        </ul>
      </TermsSection>

      <TermsSection title="Google authorization">
        <p>
          Calendar access remains subject to Google&apos;s terms and your Google
          Account settings. You may disconnect CalSnap at any time from the
          setup page or your Google Account connections.
        </p>
      </TermsSection>

      <TermsSection title="Automated extraction">
        <p>
          OCR and AI extraction can make mistakes. CalSnap is provided as a
          productivity aid and does not guarantee that every event will match
          the source image. You are responsible for checking your final
          calendar before relying on it.
        </p>
      </TermsSection>

      <TermsSection title="Availability and changes">
        <p>
          The service may be changed, suspended, or discontinued, including
          when required to protect users, comply with provider policies, or
          prevent abuse. These terms may be updated as the service changes.
        </p>
      </TermsSection>

      <TermsSection title="Disclaimer">
        <p>
          To the extent permitted by law, CalSnap is provided without warranties
          of uninterrupted availability or error-free extraction. Nothing in
          these terms limits rights that cannot legally be limited.
        </p>
      </TermsSection>

      <TermsSection title="Contact">
        <p>
          Questions about these terms can be submitted through the{" "}
          <a
            href="https://github.com/Alvaro-bit-stack/ScheduleMakerPart2/issues"
            rel="noreferrer"
            target="_blank"
          >
            CalSnap project support tracker
          </a>
          .
        </p>
      </TermsSection>
    </LegalPage>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
