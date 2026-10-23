import type { Metadata } from "next";
import { TopLogo } from "@/components/Chrome";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Contact", description: "Orders, delivery, returns, press, collabs and bookings." };

export default function ContactPage() {
  return (
    <main className="min-h-dvh">
      <TopLogo />
      <section className="grid gap-12 px-4 pt-24 sm:px-8 sm:pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h1 className="display text-[clamp(64px,13vw,200px)] leading-[0.8]">
            <span className="line-mask">
              <span>Contact</span>
            </span>
          </h1>
          <div className="mt-10 max-w-[44ch] space-y-4 text-[17px] leading-relaxed text-ink/80">
            <p>
              For merchandise, orders, delivery or returns, write to{" "}
              <a href="mailto:orders@seedhemaut.com" className="font-semibold text-ink underline underline-offset-4">
                orders@seedhemaut.com
              </a>{" "}
              or use the form.
            </p>
            <p>For fan messages, press, collaborations or bookings, pick the right reason and it reaches the right people.</p>
          </div>
        </div>
        <div className="lg:pt-6">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
