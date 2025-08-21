import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="text-center py-20 px-4 bg-gradient-soft">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6 shadow-soft">
            <GraduationCap className="h-10 w-10 text-white" />
          </div> */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Craft Your Perfect{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Statement of Purpose
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your dreams into compelling narratives. Our AI-powered SOP
            generator helps you create personalized, professional statements
            that stand out to admissions committees.
          </p>
        </div>

        <div className="animate-scale-in">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="rounded-2xl px-8 py-4 text-lg font-semibold shadow-hover hover:shadow-hover transition-all duration-300 transform hover:scale-105"
          >
            Start Building Your Future
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-slide-up">
          {[
            {
              icon: "✨",
              title: "AI-Powered",
              description: "Advanced algorithms craft personalized content",
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "Generate your SOP in under 5 minutes",
            },
            {
              icon: "🎯",
              title: "Tailored Content",
              description: "Customized for your university and program",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-card border hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
