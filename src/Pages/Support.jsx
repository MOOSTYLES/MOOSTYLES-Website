import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationBar } from '@/Components/NavigationBar';
import { Footer } from '@/Components/Footer';
import { Metadata } from '@/Components/Metadata.jsx';
import { WebsiteBackground } from '@/Components/WebsiteBackground';
import { SupportContactForm } from '@/Components/SupportContactForm';
import { ObfuscatedEmail } from '@/Components/ObfuscatedEmail';
import { Mail, ChevronDown, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACT_EMAILS = [
  {
    label: "Technical Support",
    note: "Bugs, installs, or anything not working right",
    encoded: "c3VwcG9ydEBtb29zdHlsZXMuY29t",
  },
  {
    label: "Business Inquiries",
    note: "Partnerships and collaborations",
    encoded: "YnVzaW5lc3NAbW9vc3R5bGVzLmNvbQ==",
  },
  {
    label: "General Contact",
    note: "Everything else",
    encoded: "aGVsbG9AbW9vc3R5bGVzLmNvbQ==",
  },
];

const faqCategories = [
  {
    category: "Downloads & Mods",
    questions: [
      {
        question: "How do I download your mods?",
        answer: "Every mod's page has a link to both CurseForge and Patreon, pick whichever you prefer.",
      },
      {
        question: "Are the mods safe to download?",
        answer: "Yes. Every mod is scanned for viruses and malware before it's uploaded, and checked for malicious code or unwanted software.",
      },
      {
        question: "What types of mods do you create for InZoi?",
        answer: "Right now the focus is brand-specific decorations and useful appliances, all following InZoi's modding guidelines for compatibility and safety.",
      },
      {
        question: "Where can I find installation instructions?",
        answer: "Each mod's CurseForge or Patreon page has step-by-step installation instructions specific to that mod, including any prerequisites.",
      },
      {
        question: "Do I need any prerequisites to install mods?",
        answer: "Most mods just need an up-to-date copy of the base game. Any extra dependencies are called out on that mod's page, check before downloading.",
      },
    ],
  },
  {
    category: "Support & Permissions",
    questions: [
      {
        question: "How can I support your work?",
        answer: "Subscribing on Patreon or tipping through any of the links on this site both help a lot, every contribution goes toward making more mods.",
      },
      {
        question: "Can I request ideas or commissions?",
        answer: "Requests are always welcome via the form below. Commissions aren't offered at this time.",
      },
      {
        question: "Can I use your mods in my content or videos?",
        answer: "Absolutely, videos, streams, screenshots, all welcome. Credit back to Patreon or CurseForge is appreciated but not required. Just don't claim the mods as your own work.",
      },
      {
        question: "Can I modify or redistribute your mods?",
        answer: "Please don't reupload, modify, or redistribute a mod without asking first. Derivative works and translations are usually fine, just reach out through the form below to sort out credit first.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "Do all mods work with every game version?",
        answer: "Not always, compatibility can shift with game updates. Check the mod's page for its current version requirements before downloading.",
      },
      {
        question: "A mod isn't working or I found a bug, what do I do?",
        answer: "Double-check you followed the installation steps on the correct game version first. If it's still broken, send a message below with what happened, any error messages, and a screenshot or video if you have one, that makes it much easier to track down.",
      },
      {
        question: "How often do you update mods?",
        answer: "Mods get updated as needed to stay compatible with new game versions and to fix reported issues. Follow the socials in the footer for update announcements.",
      },
      {
        question: "How do I know which mods are compatible with each other?",
        answer: "Mods that touch different parts of the game generally play well together. If two mods conflict, try disabling them one at a time to find the culprit.",
      },
    ],
  },
];

export const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemOpen = (categoryIndex, faqIndex) => openItems[`${categoryIndex}-${faqIndex}`] || false;

  return (
    <>
      <Metadata faqItems={faqCategories.flatMap((category) => category.questions)} />

      <div className="min-h-screen">
        <WebsiteBackground />
        <NavigationBar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="mod-detail__title mods-index__title newdesign-heading newdesign-brand-label">
            Support
          </h1>
          <p className="support-page__intro">
            Questions, bug reports, or just want to say hi? Reach out below, we do our best to
            reply within 24-48 hours.
          </p>

          <p className="support-page__intro">
            <BookOpen size={16} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px', marginRight: '0.4em' }} />
            Looking for step-by-step help instead? Check the <Link to="/guides">modding guides</Link> for
            installation and troubleshooting walkthroughs before reaching out.
          </p>

          <div className="support-page__contact-grid">
            {CONTACT_EMAILS.map((contact) => (
              <div key={contact.label} className="support-page__contact-card">
                <Mail size={20} className="support-page__contact-icon" aria-hidden="true" />
                <h2 className="support-page__contact-title">{contact.label}</h2>
                <p className="support-page__contact-note">{contact.note}</p>
                <ObfuscatedEmail encoded={contact.encoded} className="support-page__contact-email" />
              </div>
            ))}
          </div>

          <SupportContactForm />

          <section className="support-faq">
            <h2 className="mod-detail__section-heading support-faq__heading">
              Frequently Asked Questions
            </h2>

            {faqCategories.map((category, categoryIndex) => (
              <div key={category.category} className="support-faq__category">
                <h3 className="support-faq__category-title">{category.category}</h3>

                {category.questions.map((faq, faqIndex) => {
                  const open = isItemOpen(categoryIndex, faqIndex);
                  return (
                    <div key={faq.question} className="support-faq__item">
                      <button
                        type="button"
                        onClick={() => toggleItem(categoryIndex, faqIndex)}
                        className="support-faq__question"
                        aria-expanded={open}
                      >
                        <span>{faq.question}</span>
                        <motion.span
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="support-faq__chevron"
                        >
                          <ChevronDown size={18} aria-hidden="true" />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="support-faq__answer-wrap"
                          >
                            <p className="support-faq__answer">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
