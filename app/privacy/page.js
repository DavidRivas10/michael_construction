import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getConfig } from "@/lib/db";

export const metadata = {
  title: "Privacy Policy",
  description: "How Maykar Professional Painting collects and uses the information you send through this website.",
};

export default async function PrivacyPage() {
  const config = await getConfig();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="eyebrow mb-3">Legal</div>
        <h1 className="mb-8 font-display text-5xl font-black uppercase text-ink">Privacy Policy</h1>

        <div className="space-y-6 text-[15px] leading-relaxed text-ink-soft">
          <p>
            This website is operated by {config.businessName}. This page explains what information we collect
            through it and how we use it.
          </p>

          <h2 className="pt-2 font-display text-2xl font-bold uppercase text-ink">What we collect</h2>
          <p>
            When you request an estimate, send a message, or leave a review, we receive the information you type in:
            your name, phone number, email address (if you give one), and the details of your project or review. We
            don&apos;t use advertising or tracking cookies.
          </p>

          <h2 className="pt-2 font-display text-2xl font-bold uppercase text-ink">How we use it</h2>
          <p>
            Only to respond to your request: to contact you by phone, text message, or email about your project, to
            schedule a visit, and to prepare your quote. Reviews you submit are published on this site only after we
            approve them, showing the name and neighborhood you entered.
          </p>

          <h2 className="pt-2 font-display text-2xl font-bold uppercase text-ink">Who we share it with</h2>
          <p>
            We don&apos;t sell or rent your information. It is stored with the service providers that run this
            website (hosting, database, and email delivery) solely so the site can work.
          </p>

          <h2 className="pt-2 font-display text-2xl font-bold uppercase text-ink">Your choices</h2>
          <p>
            You can ask us at any time to update or delete the information you sent us, or to stop contacting you.
            Reach us at {config.phone}
            {config.email ? <> or {config.email}</> : null}.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
