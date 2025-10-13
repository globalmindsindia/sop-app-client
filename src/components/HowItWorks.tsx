import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, University, Upload, MessageSquare, Sparkles, Download } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: University,
      title: "Choose University & Program",
      description: "Select your target university and program from our comprehensive database of global institutions.",
      color: "from-pastel-blue via-white to-pastel-purple"
    },
    {
      icon: Upload,
      title: "Upload Your Resume",
      description: "Share your academic and professional background so our AI can understand your unique story.",
      color: "from-pastel-purple via-white to-pastel-pink"
    },
    {
      icon: MessageSquare,
      title: "Answer Key Questions",
      description: "Tell us about your motivations, experiences, and career goals through our guided questionnaire.",
      color: "from-pastel-pink via-white to-pastel-green"
    },
    {
      icon: Sparkles,
      title: "AI Generates Your SOP",
      description: "Our advanced AI crafts a personalized, compelling statement tailored to your profile and target program.",
      color: "from-pastel-green via-white to-pastel-yellow"
    },
    {
      icon: Download,
      title: "Download & Apply",
      description: "Review, download, and submit your professionally written SOP with confidence.",
      color: "from-pastel-yellow via-white to-pastel-blue"
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-gradient-to-b from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Floating pastel SVG backgrounds */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%">
          <circle cx="13%" cy="15%" r="100" fill="url(#ring1)" opacity="0.3" />
          <circle cx="85%" cy="20%" r="160" fill="url(#ring2)" opacity="0.18" />
          <circle cx="70%" cy="88%" r="120" fill="url(#ring3)" opacity="0.16" />
          <defs>
            <radialGradient id="ring1" r="100%" cx="50%" cy="50%">
              <stop stopColor="#c7d2fe" />
              <stop offset="1" stopColor="#dbeafe" />
            </radialGradient>
            <radialGradient id="ring2" r="100%" cx="50%" cy="50%">
              <stop stopColor="#fbcfe8" />
              <stop offset="1" stopColor="#fae8ff" />
            </radialGradient>
            <radialGradient id="ring3" r="100%" cx="50%" cy="50%">
              <stop stopColor="#bbf7d0" />
              <stop offset="1" stopColor="#fef9c3" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4 drop-shadow-[0_2px_18px_rgba(140,162,255,0.19)] animate-fade-in">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process makes creating your perfect SOP simple and stress-free. 
            Follow these 5 easy steps to get started.
          </p>
        </div>
        {/* Desktop visually connected steps */}
        <div className="hidden lg:flex items-center justify-between mb-16 relative z-20">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center group">
              <div className={`bg-gradient-to-br ${step.color} rounded-full p-6 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl`}>
                <step.icon className="h-10 w-10 text-primary drop-shadow animate-fade-in" />
              </div>
              <div className="mt-4 text-center max-w-[200px] mx-auto">
                <h3 className="font-semibold text-base text-foreground mb-1 mt-4 tracking-wide animate-fade-in-down">
                  Step {index + 1}
                </h3>
                <p className="text-sm font-bold text-muted-foreground animate-fade-in">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight
                  className="h-7 w-7 text-primary mx-6 flex-shrink-0 animate-pulse"
                  style={{
                    filter: "drop-shadow(0 0 12px #6366f1aa)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Mobile/Tablet: vertical cards */}
        <div className="lg:hidden space-y-8 relative z-20">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-0 shadow-card bg-gradient-card animate-fade-in-up rounded-xl overflow-hidden"
              style={{ background: `linear-gradient(135deg,var(--${step.color.replace(/ /g,'')},#fff)` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-5 group">
                  <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-4 shadow-xl`}>
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-primary text-primary-foreground text-lg font-bold px-3 py-1 rounded-full shadow-md animate-scale-in">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Detailed Steps for Desktop */}
        <div className="hidden lg:grid lg:grid-cols-1 gap-10 mt-12">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-0 shadow-card bg-gradient-card animate-fade-in-up rounded-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-400"
              style={{
                background: `linear-gradient(120deg,var(--${step.color.replace(/ /g, '')},#fff)`,
              }}
            >
              <CardContent className="p-10">
                <div className="flex items-center space-x-7">
                  <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-5 shadow-xl`}>
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="bg-primary text-primary-foreground text-base font-bold px-4 py-2 rounded-full shadow-md">
                        Step {index + 1}
                      </span>
                      <h3 className="font-semibold text-2xl text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Extra floating "bubbles" for wow effect */}
      <div aria-hidden className="absolute -top-24 left-1/2 z-0 w-[620px] h-[210px] blur-[64px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle at 40% 50%, #93c5fd 0, #e0e7ff 60%, transparent 100%)" }}>
      </div>
      <div aria-hidden className="absolute bottom-0 right-0 z-0 w-[420px] h-[120px] blur-[80px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 60%, #fbcfe8 0, #fae8ff 60%, transparent 100%)" }}>
      </div>
    </section>
  );
}
