import React, { useRef, useEffect } from "react";
import {
  RotateCcw,
  FileText,
  Info,
  ClipboardList,
  Ban,
  StretchHorizontal,
} from "lucide-react";
import Layout from "./Layout";

export default function RefundPolicy() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections = [
    {
      number: 1,
      title: "Before Work Begins",
      icon: ClipboardList,
      content: (
        <>
          <span className="font-bold text-green-700">
            Full Refund Available
          </span>
          <br />A full refund is available if the cancellation request is made
          within 7 days of payment and the SOP drafting work has not yet
          started.
        </>
      ),
    },
    {
      number: 2,
      title: "After Work Has Begun",
      icon: Ban,
      content: (
        <>
          <span className="font-bold text-red-700">No Refund</span>
          <br />
          Once the SOP writing or drafting process has started, no refund will
          be issued, as the service involves personalized time, effort, and
          intellectual work.
        </>
      ),
    },
    {
      number: 3,
      title: "Exceptional Circumstances",
      icon: Info,
      content:
        "Refund requests may be considered only in cases of genuine emergencies (e.g., serious medical condition), subject to management review. Each request will be evaluated individually.",
    },
    {
      number: 4,
      title: "Service Modifications (Transfers)",
      icon: StretchHorizontal,
      content: (
        <>
          <span className="font-bold text-blue-700">Available</span>
          <br />
          Instead of a refund, clients may request:
          <br />
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Switching to another SOP (different university/course)</li>
            <li>
              Conversion to another writing service (LOR, Motivation Letter,
              etc.)
            </li>
            <li>Rescheduling or holding the service for future use</li>
          </ul>
          <span className="text-sm text-muted-foreground mt-2 block">
            Note: Additional charges may apply based on service scope.
          </span>
        </>
      ),
    },
    {
      number: 5,
      title: "Refund Request Process",
      icon: RotateCcw,
      content: (
        <>
          <span className="font-bold text-indigo-700">Step 1: Request</span>
          <br />
          All refund or modification requests must be submitted in writing to{" "}
          <a
            href="mailto:connect@globalmindsindia.com"
            className="text-primary hover:underline inline-block"
          >
            &#128231; connect@globalmindsindia.com
          </a>
          , including payment and service details.
          <br />
          <br />
          <span className="font-bold text-indigo-700">
            Step 2: Review & Processing
          </span>
          <br />
          Approved refunds (if applicable) will be processed within 14 business
          days to the original payment method.
        </>
      ),
    },
    {
      number: 6,
      title: "Required Information",
      icon: FileText,
      content: (
        <>
          <ul className="list-disc pl-6 space-y-1">
            <li>Full name and contact information</li>
            <li>Payment transaction details</li>
            <li>
              Purpose of service (SOP for which country/course/university)
            </li>
            <li>Reason for refund or cancellation request</li>
          </ul>
        </>
      ),
    },
    {
      number: 7,
      title: "Non-Refundable Situations",
      icon: Ban,
      content: (
        <>
          <ul className="list-disc pl-6 space-y-1 text-red-600">
            <li>
              Work on SOP has already started (drafting or consulting initiated)
            </li>
            <li>
              Client fails to provide required information or stops responding
            </li>
            <li>Final draft or multiple revisions have been delivered</li>
            <li>
              Change of mind or university decision outcomes
              (rejection/withdrawal)
            </li>
          </ul>
        </>
      ),
    },
    {
      number: 8,
      title: "Contact for Refund Requests",
      icon: Info,
      content: (
        <>
          <div>
            <span className="mr-2">&#128231;</span>
            <a
              href="mailto:connect@globalmindsindia.com"
              className="text-primary hover:underline"
            >
              connect@globalmindsindia.com
            </a>
          </div>
          <div>
            <span className="mr-2">&#128222;</span>
            <a
              href="tel:+917353446655"
              className="text-primary hover:underline"
            >
              +91-7353446655
            </a>
          </div>
        </>
      ),
    },
  ];

  const sectionRefs = useRef([]);

  const handleNavClick = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Layout>
      <section className="py-16 min-h-screen px-2 sm:px-6 lg:px-16 bg-background">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary shadow-lg mb-4">
            <RotateCcw size={38} className="text-primary-foreground" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            Refund Policy
          </h1>

          <p className="text-xl text-muted-foreground font-normal max-w-xl">
            Understanding our refund and cancellation policies for SOP writing
            services.
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Left Quick Navigation */}
          <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 sticky top-24 self-start">
            <div className="bg-card rounded-2xl shadow-xl p-7 transition-all hover:shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <RotateCcw className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-foreground">
                  Quick Navigation
                </span>
              </div>

              <nav>
                <ul className="space-y-2">
                  {sections.map((sec, idx) => (
                    <li key={sec.title}>
                      <button
                        onClick={() => handleNavClick(idx)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-md
                                 text-base text-muted-foreground hover:text-primary
                                 bg-muted hover:bg-muted/70
                                 transition-all shadow-sm hover:shadow-md"
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

          {/* Main Refund Policy Content */}
          <main className="w-full flex-1 bg-card rounded-3xl shadow-2xl p-6 md:p-12 space-y-8 animate-fadeInUp animate-duration-[1500ms]">
            <div className="space-y-12">
              {sections.map(({ number, title, content }, idx) => (
                <article
                  key={number}
                  id={`section-${number}`}
                  ref={(el) => (sectionRefs.current[idx] = el)}
                  className="scroll-mt-24 rounded-xl bg-muted p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="inline-flex items-center justify-center rounded-full
                               bg-primary/10 text-primary font-bold px-3 py-1"
                    >
                      {number}
                    </span>

                    <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                      {title}
                    </h2>
                  </div>

                  <div className="text-muted-foreground leading-relaxed text-lg lg:text-xl">
                    {content}
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      </section>
    </Layout>
  );
}
