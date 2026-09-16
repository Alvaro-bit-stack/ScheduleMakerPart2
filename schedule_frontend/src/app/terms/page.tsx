import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Schedulr",
  description:
    "Terms governing use of Schedulr and its schedule-to-Google-Calendar service.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      introduction="These terms govern your access to and use of Schedulr, including its schedule-image processing and Google Calendar integration."
    >
      <Notice>
        <strong>Free-use limit:</strong> each individual may complete one
        successful schedule conversion during each rolling four-month period.
      </Notice>

      <TermsSection title="1. Acceptance of these terms">
        <p>
          By accessing Schedulr, connecting Google Calendar, or submitting a
          schedule image, you agree to these Terms of Service and acknowledge
          the{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do
          not use the service.
        </p>
      </TermsSection>

      <TermsSection title="2. Eligibility">
        <p>
          You must be at least 13 years old and legally permitted to use the
          service. If you use Schedulr on behalf of an organization, you
          represent that you have authority to accept these terms for that
          organization.
        </p>
      </TermsSection>

      <TermsSection title="3. What Schedulr provides">
        <p>
          Schedulr is a productivity tool that attempts to extract class names,
          meeting days, times, recurrence information, and locations from an
          image you submit. After you authorize Google Calendar access, Schedulr
          creates the resulting recurring events on a calendar you own.
        </p>
        <p>
          Schedulr is not an official academic record, registration system, or
          source of schedule changes. Your school&apos;s official systems
          remain the authoritative source.
        </p>
      </TermsSection>

      <TermsSection title="4. One successful use per four months">
        <ul>
          <li>
            Each individual may complete one successful schedule conversion
            during any rolling four-month period.
          </li>
          <li>
            The period begins when Schedulr successfully creates at least one
            requested Google Calendar event.
          </li>
          <li>
            An attempt that fails before creating any events does not consume
            the allowance.
          </li>
          <li>
            The allowance is personal, non-transferable, does not accumulate,
            and has no cash value.
          </li>
        </ul>
        <p>
          You may not avoid the limit through multiple accounts, browsers,
          devices, networks, altered identifiers, automation, or another
          person&apos;s credentials. Schedulr may refuse, cancel, or remove
          access associated with suspected circumvention, abuse, or excessive
          automated requests.
        </p>
      </TermsSection>

      <TermsSection title="5. Google Calendar authorization">
        <p>
          Schedulr requests the Google Calendar permission needed to manage
          events on calendars you own. Schedulr uses that permission only to
          provide the Calendar feature you choose. Google services remain
          subject to Google&apos;s own terms, policies, availability, and
          account controls.
        </p>
        <p>
          You may disconnect Schedulr from the setup page or remove access
          through your Google Account connections. Disconnecting does not
          automatically delete events already created in your Calendar.
        </p>
      </TermsSection>

      <TermsSection title="6. Your schedule images and content">
        <p>
          You retain ownership of the content you submit. You grant Schedulr and
          its service providers a limited permission to process that content
          only as necessary to operate, secure, and provide the conversion you
          request.
        </p>
        <p>
          You must have the right to submit the image and must not upload
          confidential records, government identifiers, financial information,
          health information, credentials, or unrelated personal data. Avoid
          uploading information about another person unless you are authorized
          to do so.
        </p>
      </TermsSection>

      <TermsSection title="7. Automated extraction and your responsibility">
        <p>
          Optical character recognition and artificial intelligence can make
          mistakes. Schedulr does not guarantee that extracted events will be
          complete, current, correctly timed, or free from duplication.
        </p>
        <p>
          You are responsible for reviewing the final Calendar events,
          comparing them with the official schedule, correcting errors, and
          monitoring later schedule changes. Do not rely on Schedulr as the sole
          source for attendance, examination, registration, travel, or safety
          decisions.
        </p>
      </TermsSection>

      <TermsSection title="8. Acceptable use">
        <p>You must not:</p>
        <ul>
          <li>use Schedulr for unlawful, fraudulent, or deceptive purposes;</li>
          <li>
            upload malware, malicious prompts, harmful content, or content
            designed to interfere with extraction systems;
          </li>
          <li>
            probe, scan, bypass, disrupt, overload, reverse engineer, or gain
            unauthorized access to Schedulr or its providers;
          </li>
          <li>
            misuse Google APIs, access another person&apos;s Calendar without
            permission, or create spam or misleading events;
          </li>
          <li>
            use bots, scripts, or automated systems to evade limits or consume
            unreasonable resources; or
          </li>
          <li>resell, sublicense, or transfer access to the service.</li>
        </ul>
      </TermsSection>

      <TermsSection title="9. Third-party services">
        <p>
          Schedulr relies on providers including Google Calendar, Google Cloud
          Vision, OpenAI, Vercel, and Render. Their services may be unavailable,
          changed, or subject to separate terms. Schedulr is not responsible for
          third-party services outside its control.
        </p>
      </TermsSection>

      <TermsSection title="10. Privacy">
        <p>
          The{" "}
          <Link href="/privacy">Privacy Policy</Link> explains how information
          is processed, including Google authorization, schedule-image
          processing, service providers, cookies, retention, security, and
          deletion controls.
        </p>
      </TermsSection>

      <TermsSection title="11. Suspension and termination">
        <p>
          Schedulr may suspend or terminate access when reasonably necessary to
          enforce these terms, protect users or providers, investigate abuse,
          comply with law, address security risks, or preserve service
          availability. You may stop using Schedulr and disconnect Google access
          at any time.
        </p>
      </TermsSection>

      <TermsSection title="12. Service availability and changes">
        <p>
          Schedulr may be modified, limited, suspended, or discontinued without
          guaranteeing uninterrupted availability. Features, providers,
          supported files, usage limits, and eligibility rules may change.
          Material changes will be reflected in updated terms or in-product
          notice where appropriate.
        </p>
      </TermsSection>

      <TermsSection title="13. Disclaimer">
        <p>
          To the maximum extent permitted by applicable law, Schedulr is
          provided &quot;as is&quot; and &quot;as available,&quot; without
          warranties of accuracy, reliability, availability, fitness for a
          particular purpose, non-infringement, or error-free operation. Nothing
          in these terms excludes rights or warranties that cannot legally be
          excluded.
        </p>
      </TermsSection>

      <TermsSection title="14. Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, Schedulr and its
          operator will not be liable for indirect, incidental, special,
          consequential, exemplary, or punitive damages, loss of data, missed
          classes or events, schedule errors, or interruption of service arising
          from use of or inability to use Schedulr. Liability that cannot legally
          be limited remains unaffected.
        </p>
      </TermsSection>

      <TermsSection title="15. Changes to these terms">
        <p>
          Schedulr may update these terms as the service or applicable
          requirements change. The revised date will appear at the top of this
          page. Continued use after updated terms become effective constitutes
          acceptance where permitted by law.
        </p>
      </TermsSection>

      <TermsSection title="16. Contact">
        <p>
          For a non-public request, use the user-support contact displayed on
          Schedulr&apos;s Google OAuth consent screen. General questions may also
          be submitted through the{" "}
          <a
            href="https://github.com/Alvaro-bit-stack/ScheduleMakerPart2/issues"
            rel="noreferrer"
            target="_blank"
          >
            Schedulr support tracker
          </a>
          . Do not include private schedule information, OAuth tokens, or other
          credentials in a public issue.
        </p>
      </TermsSection>
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
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
