import React, { useRef, useEffect } from "react";
import { Shield, FileText, Mail, Phone } from "lucide-react";
import Layout from "./Layout";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections = [
    {
      number: 1,
      title: "Introduction",
      icon: Shield,
      content:
        "Global Minds India is committed to safeguarding your personal information and ensuring privacy in all SOP writing and study abroad advisory services.",
    },
    {
      number: 2,
      title: "Information We Collect",
      icon: FileText,
      content: (
        <>
          <strong>Personal Information (Provided by You):</strong>
          <ul className="list-disc pl-6 mt-2 space-y-1 mb-4">
            <li>Name, email, phone number</li>
            <li>Academic details (education history, grades, test scores)</li>
            <li>Professional experience, achievements, and goals</li>
            <li>University/course preferences and country of application</li>
            <li>Personal statements or documents for SOP preparation</li>
          </ul>
          <strong>Automatically Collected:</strong>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Cookies and website usage data for service improvement</li>
            <li>Communication logs for quality and record purposes</li>
          </ul>
        </>
      ),
    },
    {
      number: 3,
      title: "Use of Information",
      icon: Shield,
      content: (
        <>
          We use your information to:
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>Draft, edit, and deliver SOPs and related study abroad documents</li>
            <li>Communicate for clarifications or revisions</li>
            <li>Provide counseling and application support</li>
            <li>Improve our services and maintain quality standards</li>
          </ul>
          We do not sell, rent, or share your personal data with third parties, except when necessary for application guidance or with your consent.
        </>
      ),
    },
    {
      number: 4,
      title: "Data Protection",
      icon: Shield,
      content:
        "Personal data is stored securely with restricted access. Documents and SOP drafts are handled confidentially. Payments are processed via secure, encrypted, PCI-compliant gateways.",
    },
    {
      number: 5,
      title: "Confidentiality of SOP Content",
      icon: Shield,
      content: (
        <>
          Your SOP content and personal details are never reused or shared. We do not disclose your information to universities or agents without your approval.
        </>
      ),
    },
    {
      number: 6,
      title: "Cookies & Tracking",
      icon: FileText,
      content:
        "We use cookies to enhance website functionality, user experience, and analytics. You may disable cookies through your browser settings.",
    },
    {
      number: 7,
      title: "Your Rights",
      icon: Shield,
      content: (
        <>
          You have the right to:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Request access to your data</li>
            <li>Request corrections or deletion of your data</li>
            <li>Withdraw consent for data usage (before work completion)</li>
          </ul>
        </>
      ),
    },
    {
      number: 8,
      title: "Contact Information",
      icon: Mail,
      content: (
        <>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <a href="mailto:connect@globalmindsindia.com" className="text-primary hover:underline">
              connect@globalmindsindia.com
            </a>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Phone className="h-5 w-5 text-primary" />
            <span>+91-7353446655</span>
          </div>
        </>
      ),
    },
  ];

  const sectionRefs = useRef([]);

  const handleNavClick = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen px-2 sm:px-6 lg:px-16">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-400 shadow-lg mb-4">
            <Shield size={38} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground font-normal max-w-xl">
            We are committed to respecting your privacy and protecting your personal data
          </p>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Left Quick Navigation Card */}
          <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl shadow-xl p-7 transform hover:scale-105 transition-transform duration-300 ease-in-out bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 hover:shadow-2xl hover:rotate-1 hover:skew-y-1">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-6 w-6 text-primary" />
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
          {/* Main Privacy Policy Content */}
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
                  <div className="text-muted-foreground leading-relaxed text-lg lg:text-xl">{content}</div>
                </article>
              ))}
            </div>
          </main>
        </div>
      </section>
    </Layout>
  );
}
