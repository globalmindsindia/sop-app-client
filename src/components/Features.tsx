import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Clock, 
  Target, 
  Shield, 
  Users, 
  Trophy,
  BookOpen,
  CheckCircle,
  Globe
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Smart Writing Assistance",
      description: "Our internal team analyzes your background and crafts compelling, personalized statements that reflect your unique story."
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get your complete SOP ready in 1 to 2 working days. No more weeks of writer's block or endless revisions."
    },
    {
      icon: Target,
      title: "University-Specific",
      description: "Tailored content that aligns with specific program requirements and university expectations."
    },
    {
      icon: Shield,
      title: "100% Original",
      description: "Every SOP is uniquely generated from scratch, ensuring complete originality and authenticity."
    },
    {
      icon: Users,
      title: "Expert-Reviewed",
      description: "Our models are built using thousands of successful SOPs reviewed by experienced admission professionals."
    },
    {
      icon: Trophy,
      title: "Proven Success",
      description: "95% of our users report improved application outcomes and higher acceptance rates."
    },
    {
      icon: BookOpen,
      title: "Multiple Formats",
      description: "Generate SOPs for various programs: MS, PhD, MBA, undergraduate applications, and more."
    },
    {
      icon: CheckCircle,
      title: "Grammar Perfect",
      description: "Built-in grammar and style checking ensures your SOP is polished and professional."
    },
    {
      icon: Globe,
      title: "Global Universities",
      description: "Supports applications to universities worldwide with region-specific formatting and requirements."
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose SOP Generator?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We combine cutting-edge technology with a deep understanding of admission processes to help you create statements that stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-pastel-blue rounded-lg p-3 flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}