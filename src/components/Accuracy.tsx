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
function AnimatedProgress({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [progress, setProgress] = React.useState(0);
  useEffect(() => {
    setTimeout(() => setProgress(value), 100);
  }, [value]);
  return <Progress value={progress} className={className} />;
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
      value: "500+",
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
      description:
        "We ensure flawless grammar and a natural flow of language in every statement.",
    },
    {
      metric: "Content Relevance",
      score: 96,
      description:
        "We tailor each SOP to match specific program requirements and university expectations.",
    },
    {
      metric: "Personalization",
      score: 94,
      description:
        "We craft unique narratives based on your personal background, goals, and experiences.",
    },
    {
      metric: "Structure & Format",
      score: 98,
      description:
        "We follow academic standards and admission committee preferences to maintain a strong structure.",
    },

    {
      metric: "Authenticity",
      score: 97,
      description:
        "We preserve your genuine voice while effectively highlighting your achievements and aspirations.",
    },

    {
      metric: "Impact & Clarity",
      score: 95,
      description:
        "We ensure your SOP leaves a lasting impression through clear, concise, and compelling storytelling.",
    },
  ];

  const certifications = [
    "Trusted and Secure Platform",
    "Data Privacy and Protection Assured",
    "Reliable Performance and Uptime",
    "Committed to Quality and Compliance",
  ];

  return (
    <section id="accuracy" className="relative py-20 w-full bg-card">
      <div className="container-app">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
            Proven <span className="text-primary">Accuracy</span> & Results
          </h2>

          <p className="font-body text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform delivers consistently high-quality results, backed by
            rigorous testing and inspiring success stories.
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border border-muted bg-card shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              <CardContent className="p-7 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mb-5 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Value */}
                <div className="font-heading text-4xl font-bold text-foreground mb-1">
                  <AnimatedNumber target={stat.value} />
                </div>

                {/* Label */}
                <div className="font-body font-semibold text-lg text-foreground mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="font-body text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* QUALITY METRICS */}
        <div className="mb-20">
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-center text-foreground mb-8">
            Quality Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accuracyMetrics.map((metric, idx) => (
              <div
                key={metric.metric}
                className="bg-muted rounded-2xl p-7 border border-muted shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-body font-medium text-foreground text-lg">
                    {metric.metric}
                  </span>

                  <span className="font-heading text-primary font-bold text-lg">
                    {metric.score}%
                  </span>
                </div>

                <AnimatedProgress
                  value={metric.score}
                  className="h-2 rounded-full bg-primary/10"
                />

                <p className="font-body text-sm text-muted-foreground mt-2">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATIONS & TRUST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card 1 */}
          <Card className="border border-muted bg-card shadow-lg">
            <CardContent className="p-7">
              <h4 className="font-heading font-semibold text-lg text-foreground mb-4">
                Security & Reliability
              </h4>

              <div className="space-y-5">
                {[
                  {
                    title: "Trusted Platform",
                    desc: "Secure and reliable service you can count on.",
                  },
                  {
                    title: "Data Protection",
                    desc: "Your privacy and data security are our priority.",
                  },
                  {
                    title: "Quality Assurance",
                    desc: "Committed to maintaining high standards.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <div className="bg-primary/10 rounded p-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-heading font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border border-muted bg-card shadow-lg">
            <CardContent className="p-7">
              <h4 className="font-heading font-semibold text-lg text-foreground mb-4">
                Why Trust Us
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
                    <div className="bg-primary/10 rounded p-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-heading font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {item.desc}
                      </p>
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
