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
        <h2>Request help</h2>
        <p className="mt-3">
          If you need help confirming deletion, open a request in the{" "}
          <a
            href="https://github.com/Alvaro-bit-stack/ScheduleMakerPart2/issues"
            rel="noreferrer"
            target="_blank"
          >
            CalSnap project support tracker
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
