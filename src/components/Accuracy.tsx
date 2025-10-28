import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Users, Star, CheckCircle } from "lucide-react";

// CountUp animation for stats
function AnimatedNumber({ target }: { target: number | string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let curr = 0;
    let num =
      typeof target === "string" && target.includes("%")
        ? Number(target.replace("%", ""))
        : typeof target === "string" && target.includes("/")
        ? Number(target.split("/")[0])
        : Number(target);

    if (isNaN(num) || !ref.current) {
      if (ref.current) ref.current.textContent = String(target);
      return;
    }

    let duration = 1200;
    let step = Math.max(1, Math.floor(num / (duration / 32)));

    const update = () => {
      curr += step;
      if (curr >= num) curr = num;
      if (ref.current) {
        if (typeof target === "string" && target.includes("%")) {
          ref.current.textContent = `${curr}%`;
        } else if (typeof target === "string" && target.includes("/")) {
          ref.current.textContent = `${curr}${target.substring(
            target.indexOf("/")
          )}`;
        } else {
          ref.current.textContent = `${curr}`;
        }
      }
      if (curr < num) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [target]);

  return <span ref={ref}>{typeof target === "number" ? target : target}</span>;
}

// Animated Progress bar
function AnimatedProgress({ value, className = "" }: { value: number; className?: string }) {
  const [progress, setProgress] = React.useState(0);
  useEffect(() => {
    setTimeout(() => setProgress(value), 100);
  }, [value]);
  return (
    <Progress value={progress} className={className} />
  );
}

export default function Accuracy() {
  const stats = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Success Rate",
      description: "of users get accepted to their target universities",
    },
    {
      icon: Award,
      value: "99%",
      label: "Quality Score",
      description: "based on grammar, coherence, and structure analysis",
    },
    {
      icon: Users,
      value: "50+",
      label: "Happy Students",
      description: "have used our platform to achieve their dreams",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "User Rating",
      description: "average rating from verified users",
    },
  ];

  const accuracyMetrics = [
    {
      metric: "Grammar & Language",
      score: 99,
      description: "We ensure flawless grammar and a natural flow of language in every statement.",
    },
    {
      metric: "Content Relevance",
      score: 96,
      description: "We tailor each SOP to match specific program requirements and university expectations.",
    },
    {
      metric: "Personalization",
      score: 94,
      description: "We craft unique narratives based on your personal background, goals, and experiences.",
    },
    {
      metric: "Structure & Format",
      score: 98,
      description: "We follow academic standards and admission committee preferences to maintain a strong structure.",
    },
    
    {
      metric: "Authenticity",
      score: 97,
      description: "We preserve your genuine voice while effectively highlighting your achievements and aspirations.",
    },

    {
      metric: "Impact & Clarity",
      score: 95,
      description: "We ensure your SOP leaves a lasting impression through clear, concise, and compelling storytelling.",
    },
  ];

  const certifications = [
    "SOC 2 Type II Certified",
    "GDPR Compliant",
    "ISO 27001 Certified",
    "Educational Technology Standards",
  ];

  return (
    <section
      id="accuracy"
      className="relative py-20 w-full bg-gradient-to-br from-blue-50 via-white to-pastel-blue-100 overflow-hidden"
    >
      {/* Subtle animated background blobs */}
      <div className="absolute -top-32 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full blur-3xl opacity-30 animate-float" />
      <div className="absolute right-0 -bottom-32 w-96 h-80 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl opacity-20 animate-float2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-gradient bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
            Proven Accuracy & Results
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto mt-3 mb-2">
            Our platform delivers consistently high-quality results, backed by rigorous testing and inspiring success stories.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-16">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-0 shadow-large-glass bg-gradient-to-br from-pastel-blue-200/80 to-blue-100/60 backdrop-blur-lg filter hover:scale-[1.04] transition-transform duration-300 hover:shadow-2xl animate-fade-in"
            >
              <CardContent className="p-7 flex flex-col items-center text-center">
                <div className="bg-gradient-to-b from-primary/20 to-pastel-blue-400 rounded-full p-4 w-16 h-16 mx-auto mb-5 flex items-center justify-center transition-shadow duration-300 shadow-inner-glow-inner hover:shadow-glow-lg">
                  <stat.icon className="h-8 w-8 text-primary drop-shadow" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-1 tracking-tight">
                  <AnimatedNumber target={stat.value} />
                </div>
                <div className="font-semibold text-lg text-foreground mb-1">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quality Metrics */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-7 text-center bg-gradient-to-r from-primary/80 via-blue-300/80 to-secondary/80 bg-clip-text text-transparent">
            Quality Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accuracyMetrics.map((metric, idx) => (
              <div
                key={metric.metric}
                className="animate-fade-slide-up bg-gradient-to-br from-muted/50 via-white/70 to-pastel-blue-100/70 rounded-2xl p-7 hover:scale-105 hover:shadow-xl group transition-all duration-300 cursor-pointer border border-primary/10 shadow-md"
                style={{ animationDelay: `${0.06 * idx}s` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground text-left text-lg">
                    {metric.metric}
                  </span>
                  <span
                    className="text-primary font-bold text-lg animate-bounce-ltr"
                    style={{ animationDelay: `${0.06 * idx}s` }}
                  >
                    {metric.score}%
                  </span>
                </div>
                <div>
                  <AnimatedProgress
                    value={metric.score}
                    className="h-2 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 shadow-inner"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-left mt-2">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Trust */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Certifications */}
          <Card className="border-0 shadow-large-glass bg-gradient-to-bl from-primary/10 via-white/90 to-blue-100/80 backdrop-blur-lg">
            <CardContent className="p-7">
              <h4 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-2 inline" />
                Our Certifications
              </h4>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Reasons */}
          <Card className="border-0 shadow-large-glass bg-gradient-to-bl from-secondary/10 via-white/90 to-primary/10 backdrop-blur-lg">
            <CardContent className="p-7">
              <h4 className="font-semibold text-lg text-foreground mb-4">
                Why Universities Trust Us
              </h4>
              <div className="space-y-5">
                {[
                  {
                    title: "Authentic Content",
                    desc: "Every SOP reflects genuine student experiences.",
                  },
                  {
                    title: "Academic Standards",
                    desc: "Meets all academic writing requirements.",
                  },
                  {
                    title: "Plagiarism-Free",
                    desc: "100% original content guaranteed.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <div className="bg-pastel-green rounded p-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
