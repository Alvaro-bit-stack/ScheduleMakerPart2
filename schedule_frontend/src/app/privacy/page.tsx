import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — CalSnap",
  description:
    "How CalSnap accesses, uses, protects, and deletes schedule and Google Calendar data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      introduction="This policy explains what CalSnap processes when you turn a schedule screenshot into Google Calendar events."
    >
      <PolicySection title="Information CalSnap processes">
        <ul>
          <li>
            A Google OAuth access token granting permission to manage events on
            calendars you own.
          </li>
          <li>
            The schedule image you choose to upload and the class details
            extracted from it, including course names, times, meeting days, and
            locations.
          </li>
          <li>Your selected timezone and optional calendar color theme.</li>
        </ul>
      </PolicySection>

      <PolicySection title="How the information is used">
        <p>
          CalSnap uses the Google Calendar permission only to create the
          recurring class events you explicitly request. CalSnap does not use
          Calendar data for advertising, profiling, credit decisions, or sale.
        </p>
        <p>
          CalSnap&apos;s use and transfer of information received from Google
          APIs complies with the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            rel="noreferrer"
            target="_blank"
          >
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements.
        </p>
      </PolicySection>

      <PolicySection title="Service providers and data transfers">
        <p>
          The uploaded schedule image is sent to Google Cloud Vision for
          optical character recognition and to OpenAI for schedule extraction.
          The resulting class details are sent to Google Calendar to create
          events. CalSnap does not send your Google access token or existing
          Calendar event content to Google Cloud Vision or OpenAI.
        </p>
        <p>
          These providers process information under their applicable service
          terms and configured retention controls.
        </p>
      </PolicySection>

      <PolicySection title="Storage and retention">
        <p>
          The Google access token is encrypted in a Secure, HttpOnly session
          cookie in production and expires in about one hour. CalSnap does not
          request or retain a Google refresh token.
        </p>
        <p>
          Schedule images and extracted class records are processed in memory
          for the requested calendar operation and are not intentionally stored
          in a CalSnap database. CalSnap does not intentionally write OAuth
          tokens, schedule contents, class locations, or Calendar event links
          to application logs.
        </p>
      </PolicySection>

      <PolicySection title="Your controls and deletion">
        <p>
          Use the Disconnect control on the setup page to revoke the active
          Google token and remove the CalSnap session cookie. You can also
          remove CalSnap through your{" "}
          <a
            href="https://myaccount.google.com/connections"
            rel="noreferrer"
            target="_blank"
          >
            Google Account connections
          </a>
          .
        </p>
        <p>
          See the{" "}
          <Link href="/data-deletion">data deletion instructions</Link> for
          complete steps.
        </p>
      </PolicySection>

      <PolicySection title="Security">
        <p>
          CalSnap uses HTTPS in production, short-lived encrypted sessions,
          OAuth state validation, PKCE, authenticated server-to-server requests,
          restricted file types, and upload limits. No internet service can
          guarantee absolute security, but CalSnap limits the data and access it
          retains.
        </p>
      </PolicySection>

      <PolicySection title="Children and changes">
        <p>
          CalSnap is not directed to children under 13. This policy may be
          updated when the service or its providers change. Material changes
          will be reflected on this page before new data practices are used.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>
          For privacy or deletion questions, open a support request in the{" "}
          <a
            href="https://github.com/Alvaro-bit-stack/ScheduleMakerPart2/issues"
            rel="noreferrer"
            target="_blank"
          >
            CalSnap project support tracker
          </a>
          .
        </p>
      </PolicySection>
    </LegalPage>
  );
}

function PolicySection({
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
