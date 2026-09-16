import type { Metadata } from "next";
import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Data Deletion — CalSnap",
  description:
    "How to disconnect CalSnap, revoke Google access, and remove locally held session data.",
};

export default function DataDeletionPage() {
  return (
    <LegalPage
      eyebrow="Your controls"
      title="Data deletion instructions"
      introduction="CalSnap does not maintain user accounts or intentionally persist uploaded schedules in its own database."
    >
      <section>
        <h2>Disconnect from the setup page</h2>
        <p className="mt-3">
          Select <strong>Disconnect</strong> in the CalSnap setup-page header.
          CalSnap attempts to revoke the active Google access token and deletes
          the encrypted session cookie from your browser.
        </p>
      </section>

      <section>
        <h2>Remove access through Google</h2>
        <p className="mt-3">
          Open{" "}
          <a
            href="https://myaccount.google.com/connections"
            rel="noreferrer"
            target="_blank"
          >
            Google Account connections
          </a>
          , find CalSnap, and remove its access. This invalidates any remaining
          Google authorization.
        </p>
      </section>

      <section>
        <h2>Automatic deletion</h2>
        <p className="mt-3">
          The encrypted CalSnap session cookie expires in about one hour.
          Uploaded schedule images and extracted class details are processed
          for the requested operation and are not intentionally retained in a
          CalSnap database.
        </p>
      </section>

      <section>
        <h2>Usage-limit and security information</h2>
        <p className="mt-3">
          CalSnap may retain the minimum technical or pseudonymous information
          reasonably necessary to administer the rolling four-month usage
          allowance, protect the service, investigate abuse, and comply with
          law. You may request deletion of eligible information, but deletion
          does not reset the usage allowance or permit circumvention of service
          limits.
        </p>
      </section>

      <section>
        <h2>Request help</h2>
        <p className="mt-3">
          For a non-public deletion request, use the user-support contact shown
          on CalSnap&apos;s Google OAuth consent screen. General questions can
          be submitted through the{" "}
          <a
            href="https://github.com/Alvaro-bit-stack/ScheduleMakerPart2/issues"
            rel="noreferrer"
            target="_blank"
          >
            CalSnap project support tracker
          </a>
          . Do not include OAuth tokens, schedule images, class locations, or
          other private information in a public issue.
        </p>
      </section>
    </LegalPage>
  );
}
