import PageIntro from "@/components/PageIntro";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "What information FursuitCommissions.com collects through its forms and shop, how it is used, and your choices.",
  path: "/privacy-policy/",
});

// Describes what this codebase actually does. Have it reviewed before launch
// (see docs/CONTENT-TODO.md), and update it if new tools are added.
const sections = [
  {
    h: "What we collect",
    p: [
      "Quote, repair and contact forms: your name, email address, optional messaging handle, the details you write about your character or suit, and any images, PDFs or links you attach.",
      "Shop orders are handled by our WooCommerce store and payment providers (PayPal, Stripe), which collect the billing and shipping details needed to fulfil your order.",
      "If you accept analytics cookies, Google Tag Manager loads analytics tools that record anonymous usage such as pages visited. If you decline, they are not loaded.",
    ],
  },
  {
    h: "How we use it",
    p: [
      "Form submissions are emailed to our studio inbox so we can reply, prepare quotes, assess repairs and manage your commission. We don't sell your information or add you to marketing lists from these forms.",
      "Reference images are used only to design, quote and build your commission.",
    ],
  },
  {
    h: "How long we keep it",
    p: ["We keep inquiry emails for as long as needed to handle your request and any resulting order, and as required for accounting and legal purposes."],
  },
  {
    h: "Your choices",
    p: [
      "You can ask us to access, correct or delete the information you've sent by emailing us.",
      "You can opt out of your finished commission appearing in our portfolio or social media at any time, as described in our Terms.",
      "To change your cookie choice, clear this site's data in your browser and choose again.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Privacy Policy", path: "/privacy-policy/" }]} title="Privacy Policy" lede="A plain-language summary of what we collect and why." />
      <article className="container-x max-w-3xl py-12">
        {sections.map((s) => (
          <section key={s.h} className="mb-10">
            <h2 className="text-2xl font-semibold">{s.h}</h2>
            {s.p.map((t) => (
              <p key={t} className="mt-3 text-ink">
                {t}
              </p>
            ))}
          </section>
        ))}
        <p className="text-ink">
          Contact:{" "}
          {site.email ? (
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
          ) : (
            "use our contact form"
          )}
        </p>
      </article>
    </>
  );
}
