import React, { useRef } from "react";
import { FileText, User, Shield, CreditCard, Info, Scale } from "lucide-react";
import Layout from "./Layout";

export default function TermsAndConditions() {
  const sections = [
    {
      number: 1,
      title: "Introduction",
      content:
        'Welcome to Global Minds India ("we," "us," or "our"). By availing our SOP (Statement of Purpose) writing or editing services, you agree to be bound by these Terms and Conditions. Please review them carefully before proceeding.',
      icon: FileText,
    },
    {
      number: 2,
      title: "Scope of Service",
      content:
        "Our services include SOP drafting, editing, reviewing, and consultation based on the information provided by the student. We do not guarantee university admission, visa approval, or scholarship outcomes. Our role is limited to content support and guidance.",
      icon: FileText,
    },
    {
      number: 3,
      title: "Client Responsibility",
      content:
        "The client must provide accurate personal, academic, and professional details required to draft the SOP. Any false or misleading information provided by the client is not our responsibility. All final content must be reviewed and approved by the client before submission to any institution.",
      icon: User,
    },
    {
      number: 4,
      title: "Fees & Payments",
      content:
        "Full payment is required to initiate the SOP service. Payments once made are non-refundable, as the service involves personalized effort and intellectual work. Revisions are included only as per the agreed plan/package. Additional revisions may incur extra charges.",
      icon: CreditCard,
    },
    {
      number: 5,
      title: "Delivery & Timelines",
      content:
        "Estimated delivery timelines will be informed at the time of booking. Delays caused due to late submission of information/documents by the client are not our responsibility. Urgent delivery requests (express service) may have additional fees.",
      icon: FileText,
    },
    {
      number: 6,
      title: "Revisions Policy",
      content:
        "Revisions are limited to corrections, clarifications, or minor changes based on original input. Major changes such as course/university change, profile modification, or rewrites will be treated as a new request.",
      icon: FileText,
    },
    {
      number: 7,
      title: "Intellectual Property & Usage",
      content:
        "All drafted SOP content is exclusively for the client’s personal use for university applications. Unauthorized sharing, resale, duplication, or publication of SOP content is strictly prohibited. We reserve the right to retain anonymized content for training and quality improvement purposes.",
      icon: Shield,
    },
    {
      number: 8,
      title: "Limitation of Liability",
      content:
        "Our liability is limited to the fee paid for the SOP service. We are not liable for rejection by universities, immigration authorities, or any third party decisions.",
      icon: FileText,
    },
    {
      number: 9,
      title: "Confidentiality",
      content:
        "All personal data and information shared by the client will remain confidential and used solely for SOP preparation. We do not share client information with any third party without consent.",
      icon: Shield,
    },
    {
      number: 10,
      title: "Changes to Terms",
      content:
        "These Terms and Conditions may be updated at any time. Notice will be provided for any significant changes.",
      icon: FileText,
    },
    {
      number: 11,
      title: "Contact Information",
      content: (
        <>
          For any queries or support related to SOP services, please contact:
          <br />
          <a
            href="mailto:connect@globalmindsindia.com"
            className="text-primary hover:underline"
            aria-label="Send email to connect@globalmindsindia.com"
          >
            &#128231; connect@globalmindsindia.com
          </a>
          <br />
          <a
            href="tel:+917353446655"
            className="text-primary hover:underline"
            aria-label="Call +91 7353446655"
          >
            &#128222; +91-7353446655
          </a>
        </>
      ),
      icon: Info,
    },
  ];

  const sectionRefs = useRef([]);

  const handleNavClick = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen px-2 sm:px-6 lg:px-16">
      {/* Header design matching uploaded image */}
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center mb-10">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-400 shadow-lg mb-4">
          <Scale size={38} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-2">
          Terms and Conditions
        </h1>
        <p className="text-xl text-muted-foreground font-normal">
          Please read these terms carefully before availing our SOP writing services at Global Minds India.
        </p>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Quick Navigation Card with sticky positioning */}
        <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 sticky top-24 self-start">
          <div className="bg-white rounded-2xl shadow-xl p-7 transform hover:scale-105 transition-transform duration-300 ease-in-out bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 hover:shadow-2xl hover:rotate-1 hover:skew-y-1">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">Quick Navigation</span>
            </div>
            <nav>
              <ul className="space-y-2">
                {sections.map((sec, idx) => (
                  <li key={sec.title}>
                    <button
                      onClick={() => handleNavClick(idx)}
                      className="flex items-center gap-2 text-base group text-muted-foreground hover:text-primary w-full transition-all bg-gradient-to-br from-white to-gray-100 hover:from-pink-50 hover:to-yellow-50 rounded-md px-3 py-2 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                    >
                      <sec.icon className="h-5 w-5 text-primary" />
                      <span>{sec.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
        {/* Main Terms Content - no additional section header! */}
        <main className="w-full flex-1 bg-white/95 rounded-3xl shadow-2xl p-6 md:p-12 space-y-8 animate-fadeInUp animate-duration-[1500ms]">
          <div className="space-y-12">
            {sections.map(({ number, title, content }, idx) => (
              <article
                key={number}
                className="scroll-mt-24 bg-gradient-to-tr from-white via-gray-50 to-gray-100 rounded-xl shadow-lg p-6 hover:scale-105 hover:rotate-1 transition-transform duration-300 ease-in-out"
                id={`section-${number}`}
                ref={(el) => (sectionRefs.current[idx] = el)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold px-3 py-1 shadow-md hover:shadow-xl hover:scale-110 transition-transform duration-200">
                    {number}
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg lg:text-xl">
                  {typeof content === "string" ? content : content}
                </p>
              </article>
            ))}
          </div>
        </main>
      </div>
    </section>
    </Layout>
  );
}
