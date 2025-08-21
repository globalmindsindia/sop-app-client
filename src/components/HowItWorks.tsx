import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, University, Upload, MessageSquare, Sparkles, Download } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: University,
      title: "Choose University & Program",
      description: "Select your target university and program from our comprehensive database of global institutions.",
      color: "bg-pastel-blue"
    },
    {
      icon: Upload,
      title: "Upload Your Resume",
      description: "Share your academic and professional background so our AI can understand your unique story.",
      color: "bg-pastel-purple"
    },
    {
      icon: MessageSquare,
      title: "Answer Key Questions",
      description: "Tell us about your motivations, experiences, and career goals through our guided questionnaire.",
      color: "bg-pastel-pink"
    },
    {
      icon: Sparkles,
      title: "AI Generates Your SOP",
      description: "Our advanced AI crafts a personalized, compelling statement tailored to your profile and target program.",
      color: "bg-pastel-green"
    },
    {
      icon: Download,
      title: "Download & Apply",
      description: "Review, download, and submit your professionally written SOP with confidence.",
      color: "bg-pastel-yellow"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process makes creating your perfect SOP simple and stress-free. 
            Follow these 5 easy steps to get started.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Flow */}
          <div className="hidden lg:flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`${step.color} rounded-full p-4 shadow-soft`}>
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4 text-center max-w-[200px]">
                    <h3 className="font-semibold text-sm text-foreground mb-2">
                      Step {index + 1}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-primary mx-8 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-card bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`${step.color} rounded-lg p-3 flex-shrink-0`}>
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-lg text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Steps for Desktop */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-card bg-gradient-card animate-fade-in">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-6">
                    <div className={`${step.color} rounded-2xl p-4 flex-shrink-0`}>
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                          Step {index + 1}
                        </span>
                        <h3 className="font-semibold text-xl text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}