import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Minus, Plus } from "lucide-react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question:
        "What is a Statement of Purpose (SOP) and why is it crucial for my application?",
      answer:
        "A Statement of Purpose is a personalized essay that explains your academic background, career goals, and reasons for choosing a specific program. It's crucial because it's the only subjective part of your application that allows admissions committees to understand your personality, motivations, and potential fit for their program. While grades and test scores are objective, your SOP tells your unique story and can compensate for weaker academic profiles by highlighting your aspirations and experiences.",
      highlight: true,
    },
    {
      question: "How does an SOP impact my chances of admission?",
      answer:
        "An SOP significantly impacts admission decisions as it demonstrates your communication skills, commitment to the field, and alignment with the program's objectives. It helps distinguish you from thousands of other applicants with similar academic credentials. A compelling SOP can be the deciding factor that gets you accepted, especially for competitive programs where multiple candidates have similar qualifications.",
      highlight: true,
    },
    {
      question: "What should I include in my SOP?",
      answer:
        "Your SOP should include: your academic background and achievements, relevant professional experience, specific reasons for choosing the program and university, short-term and long-term career goals, key projects or research experiences, and what unique value you'll bring to the program. Structure it with a compelling introduction, detailed body paragraphs covering your journey, and a strong conclusion linking everything to your future aspirations.",
    },
    {
      question: "How long should my SOP be?",
      answer:
        "Most universities require SOPs between 800-1000 words, typically 2 pages double-spaced. However, always check specific university requirements as some may have different word limits. Focus on being concise while covering all essential points - quality matters more than quantity.",
    },
    {
      question: "What are the most common SOP mistakes I should avoid?",
      answer:
        "Avoid these critical mistakes: using generic templates instead of personalizing your SOP, being dishonest or exaggerating achievements, focusing only on past accomplishments without connecting them to future goals, writing in an informal tone or using slang, submitting without thorough proofreading, failing to research the specific program and university, being too vague about your career objectives, and not following the university's specific guidelines and format requirements.",
    },
    {
      question: "How do I make my SOP stand out from other applicants?",
      answer:
        "Make your SOP unique by: sharing specific experiences that shaped your career interests, demonstrating genuine passion for your chosen field, showing deep research about the program and mentioning specific faculty or resources, connecting your past experiences logically to your future goals, using concrete examples with measurable results, and maintaining authenticity while avoiding clichés. Your personal story and genuine motivation should shine through.",
    },
    {
      question: "Should I mention my weaknesses or low grades in my SOP?",
      answer:
        "If you have significant academic weaknesses or gaps, address them briefly and honestly, but focus on what you learned from these experiences and how you've grown. Don't dwell on negatives - instead, emphasize your current readiness and commitment. Show how your experiences, even challenging ones, have prepared you for graduate studies.",
    },
    {
      question: "How specific should I be about the university and program?",
      answer:
        "Be very specific! Research the program thoroughly and mention particular faculty members whose research aligns with your interests, unique resources or labs you want to access, specific courses that excite you, and how the program's philosophy matches your goals. This shows genuine interest and helps admissions committees see you as a serious candidate who has done their homework.",
    },
    {
      question: "Can I use the same SOP for multiple universities?",
      answer:
        "Never use the exact same SOP for different universities. While you can keep the core structure and personal experiences consistent, always customize each SOP to reflect why you're specifically interested in that particular program and institution. Mention specific faculty, resources, and opportunities unique to each university.",
    },
    {
      question: "What tone should I maintain in my SOP?",
      answer:
        "Maintain a professional yet personal tone. Be formal but not overly academic or dry. Show enthusiasm and passion while remaining respectful and mature. Write in the active voice, use clear and concise language, avoid jargon unless necessary, and ensure your personality comes through while maintaining academic professionalism.",
    },
    {
      question: "How important is the opening paragraph of my SOP?",
      answer:
        "The opening paragraph is extremely important as it sets the first impression and determines whether the admissions committee will read your SOP with interest. Start with a compelling hook - perhaps a meaningful experience, defining moment, or clear statement of your goals. Avoid generic openings like 'I have always been interested in...' and instead create an engaging start that reflects your unique journey.",
      highlight: true,
    },
    {
      question: "Should I include my research experience in my SOP?",
      answer:
        "Absolutely! Research experience is highly valuable and should be prominently featured in your SOP. Describe your research projects, methodologies used, key findings, and what you learned from the experience. Explain how this research sparked your interest in the field and how it relates to your future academic goals. Even undergraduate research projects can demonstrate your commitment and analytical skills.",
    },
    {
      question: "How do I connect my past experiences to my future goals?",
      answer:
        "Create a logical narrative that shows progression from your past experiences to your current interests and future aspirations. Explain how each experience - academic, professional, or personal - contributed to your understanding of the field and shaped your career goals. Use transition phrases to show cause-and-effect relationships and demonstrate that your decision to pursue this program is well-thought-out and purposeful.",
    },
    {
      question:
        "What if I'm changing fields - how do I address this in my SOP?",
      answer:
        "If you're transitioning to a new field, clearly explain your motivation for the change and how your previous experience provides transferable skills. Highlight relevant coursework, projects, or experiences that demonstrate your commitment to the new field. Show that you've thought carefully about this transition and have taken steps to prepare for it, such as additional courses, certifications, or relevant projects.",
    },
    {
      question: "How many drafts should I write before submitting my SOP?",
      answer:
        "Plan to write multiple drafts - typically 5-8 revisions are normal for a strong SOP. Start with a rough outline, then expand into a first draft focusing on content. Subsequent drafts should refine structure, clarity, and flow. Have trusted mentors, professors, or professionals review your drafts and provide feedback. The final draft should be polished, error-free, and compelling. Allow several weeks for this iterative process.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about creating a compelling Statement of
            Purpose that gets you noticed by admissions committees.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className={`border-0 shadow-card transition-all duration-200 hover:shadow-lg ${
                faq.highlight
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-primary"
                  : "bg-gradient-card"
              }`}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold text-lg text-foreground pr-4 ${
                        faq.highlight ? "text-primary" : ""
                      }`}
                    >
                      {faq.question}
                      {faq.highlight && (
                        <span className="inline-flex items-center ml-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                          Important
                        </span>
                      )}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <Minus className="h-5 w-5 text-primary" />
                      ) : (
                        <Plus className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                </button>

                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call-to-Action */}
        {/* <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Create Your Perfect SOP?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Don't let a poorly written SOP hurt your chances. Our AI-powered
              platform helps you craft compelling, personalized statements that
              highlight your unique story and align with your target program's
              requirements.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Writing Your SOP
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FAQSection;
