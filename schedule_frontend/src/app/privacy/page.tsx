import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Schedulr",
  description:
    "How Schedulr collects, uses, protects, retains, and deletes schedule and Google Calendar data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      introduction="This policy explains how Schedulr handles information when you convert a class-schedule image into recurring Google Calendar events."
    >
      <Notice>
        <strong>In short:</strong> Schedulr uses a short-lived Google access token
        to create the events you request. Schedule images are processed by
        Google Cloud Vision and OpenAI. Schedulr does not sell personal
        information, use Google data for advertising, or request access to your
        Google profile or email address.
      </Notice>

      <PolicySection title="1. Scope of this policy">
        <p>
          This policy applies to the Schedulr website, its Google Calendar
          connection, and the backend services used to process schedule images.
          In this policy, &quot;Schedulr,&quot; &quot;we,&quot; and
          &quot;our&quot; refer to the operator of the Schedulr service.
        </p>
      </PolicySection>

      <PolicySection title="2. Information Schedulr processes">
        <h3>Information you provide</h3>
        <ul>
          <li>
            The schedule image you choose to upload and the information visible
            in it, which may include course names, sections, meeting days,
            times, instructors, buildings, and room locations.
          </li>
          <li>Your selected timezone and optional calendar color theme.</li>
        </ul>

        <h3>Google authorization information</h3>
        <ul>
          <li>
            A short-lived Google OAuth access token that permits Schedulr to view
            and edit events on calendars you own.
          </li>
          <li>
            Technical authorization information required to complete and secure
            the OAuth flow, including OAuth state, PKCE verification data,
            granted scopes, and token expiration time.
          </li>
        </ul>
        <p>
          Schedulr does not request Google profile, email, contacts, Drive, or
          Gmail permissions. Schedulr does not need to read your existing
          Calendar events to extract your uploaded schedule.
        </p>

        <h3>Technical information</h3>
        <p>
          Vercel, Render, and other infrastructure providers may automatically
          process basic request information such as IP address, request time,
          browser or device information, requested route, response status, and
          security events. This information is used to deliver the service,
          diagnose failures, protect Schedulr, prevent abuse, and administer
          service limits.
        </p>
      </PolicySection>

      <PolicySection title="3. How Schedulr uses information">
        <p>Schedulr processes information only as needed to:</p>
        <ul>
          <li>read the schedule image you intentionally submit;</li>
          <li>extract and validate class details;</li>
          <li>
            create the recurring Google Calendar events you explicitly request;
          </li>
          <li>display submission success or error feedback;</li>
          <li>
            operate, secure, troubleshoot, and prevent abuse of the service;
          </li>
          <li>administer the one-use-per-four-month service allowance; and</li>
          <li>comply with applicable law and enforce the Terms of Service.</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Schedule processing and service providers">
        <p>
          Schedulr uses the following providers to perform the conversion you
          request:
        </p>
        <ul>
          <li>
            <strong>Google Cloud Vision</strong> processes the uploaded image to
            recognize visible text.
          </li>
          <li>
            <strong>OpenAI</strong> processes the image and recognized text to
            identify class names, meeting days, times, and locations.
          </li>
          <li>
            <strong>Google Calendar</strong> receives the validated event
            details and creates the requested recurring events.
          </li>
          <li>
            <strong>Vercel and Render</strong> host the application and process
            requests needed to provide it.
          </li>
        </ul>
        <p>
          Schedulr does not send your Google OAuth token or the contents of your
          existing Calendar events to Google Cloud Vision or OpenAI. These
          providers process information under their own applicable terms,
          privacy policies, security controls, and configured retention
          settings.
        </p>
      </PolicySection>

      <PolicySection title="5. Google API data and Limited Use">
        <p>
          Schedulr uses information received from Google APIs only to provide the
          user-facing Calendar feature you choose. Schedulr&apos;s use and
          transfer of information received from Google APIs complies with the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            rel="noreferrer"
            target="_blank"
          >
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements.
        </p>
        <p>
          Schedulr does not sell Google user data, use it for advertising,
          retargeting, credit decisions, surveillance, or unrelated analytics,
          or permit humans to read it except when required for security,
          support with your affirmative permission, or legal compliance.
        </p>
      </PolicySection>

      <PolicySection title="6. Cookies and OAuth security">
        <p>
          Schedulr uses strictly necessary cookies to secure the Google
          connection:
        </p>
        <ul>
          <li>
            OAuth state and PKCE cookies expire after approximately ten minutes
            and protect the authorization flow from interception and request
            forgery.
          </li>
          <li>
            The Google access token is encrypted in a Secure, HttpOnly cookie
            in production, is unavailable to page JavaScript, and expires in
            approximately one hour.
          </li>
        </ul>
        <p>
          Schedulr does not request or retain a Google refresh token and does not
          use advertising or cross-site tracking cookies.
        </p>
      </PolicySection>

      <PolicySection title="7. One-use-per-four-month allowance">
        <p>
          Schedulr currently permits one successful schedule conversion per
          individual during each rolling four-month period. A successful
          conversion occurs when Schedulr creates at least one requested event in
          Google Calendar. A failed attempt that creates no events does not use
          the allowance.
        </p>
        <p>
          Schedulr does not request Google identity scopes solely to administer
          this limit. Where usage controls are applied, Schedulr may use the
          minimum technical or pseudonymous signals reasonably necessary—such
          as a last-success timestamp, session or authorization signal, or
          network-based abuse indicator—to determine eligibility and prevent
          attempts to evade the limit. These signals are not used for
          advertising or general profiling.
        </p>
      </PolicySection>

      <PolicySection title="8. Storage and retention">
        <ul>
          <li>
            <strong>Google access tokens:</strong> retained only in the
            encrypted browser session cookie until expiration, disconnection,
            or revocation.
          </li>
          <li>
            <strong>Schedule images and extracted class details:</strong>{" "}
            processed for the requested operation and not intentionally stored
            in a Schedulr application database.
          </li>
          <li>
            <strong>Usage and security information:</strong> retained only as
            long as reasonably necessary to operate the rolling four-month
            limit, protect the service, investigate abuse, comply with law, and
            maintain operational records.
          </li>
          <li>
            <strong>Provider logs:</strong> may be retained by hosting and
            processing providers according to their configured settings and
            policies.
          </li>
        </ul>
        <p>
          Schedulr does not intentionally write OAuth tokens, schedule contents,
          classroom locations, or Google Calendar event links to application
          logs.
        </p>
      </PolicySection>

      <PolicySection title="9. Sharing and disclosure">
        <p>
          Schedulr does not sell or rent personal information. Information is
          disclosed only to the service providers described above as necessary
          to complete your request, to investigate security or abuse, to comply
          with applicable law, or as part of a business transfer where legally
          permitted and subject to appropriate notice.
        </p>
      </PolicySection>

      <PolicySection title="10. Your choices and deletion">
        <ul>
          <li>
            Use <strong>Disconnect</strong> on the setup page to revoke the
            active Google token and delete the Schedulr session cookie.
          </li>
          <li>
            Remove Schedulr through your{" "}
            <a
              href="https://myaccount.google.com/connections"
              rel="noreferrer"
              target="_blank"
            >
              Google Account connections
            </a>
            .
          </li>
          <li>
            Do not upload a schedule if you do not want it processed by the
            providers described in this policy.
          </li>
        </ul>
        <p>
          See the{" "}
          <Link href="/data-deletion">data deletion instructions</Link> for
          additional details. Deleting information does not create a new usage
          allowance or permit circumvention of the four-month limit.
        </p>
      </PolicySection>

      <PolicySection title="11. Security">
        <p>
          Schedulr uses HTTPS in production, OAuth state validation, PKCE,
          encrypted short-lived sessions, authenticated server-to-server
          requests, restricted file types, upload limits, and dependency
          security checks. No internet service can guarantee absolute security,
          but Schedulr limits the data and authorization it retains.
        </p>
      </PolicySection>

      <PolicySection title="12. Children">
        <p>
          Schedulr is not directed to children under 13, and users under 13 must
          not use the service. If you believe a child has submitted personal
          information, contact Schedulr so the issue can be reviewed.
        </p>
      </PolicySection>

      <PolicySection title="13. Changes to this policy">
        <p>
          This policy may be updated when Schedulr, its providers, or applicable
          requirements change. The revised date will appear at the top of this
          page. Material changes to how Google user data is used will be
          disclosed before the new practice begins where required.
        </p>
      </PolicySection>

      <PolicySection title="14. Contact">
        <p>
          For a non-public privacy or deletion request, use the user-support
          contact displayed on Schedulr&apos;s Google OAuth consent screen.
          General questions may also be submitted through the{" "}
          <a
            href="https://github.com/Alvaro-bit-stack/ScheduleMakerPart2/issues"
            rel="noreferrer"
            target="_blank"
          >
            Schedulr support tracker
          </a>
          . Do not include OAuth tokens, schedule images, class locations, or
          other private information in a public issue.
        </p>
      </PolicySection>
    </LegalPage>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--landing-border-strong)] bg-[var(--landing-sage)] p-5 leading-7 text-[var(--landing-forest)]">
      {children}
    </div>
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
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
