import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Users, Star, CheckCircle } from "lucide-react";

export default function Accuracy() {
  const stats = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Success Rate",
      description: "of users get accepted to their target universities"
    },
    {
      icon: Award,
      value: "98%",
      label: "Quality Score",
      description: "based on grammar, coherence, and structure analysis"
    },
    {
      icon: Users,
      value: "50K+",
      label: "Happy Students",
      description: "have used our platform to achieve their dreams"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "User Rating",
      description: "average rating from verified users"
    }
  ];

  const accuracyMetrics = [
    {
      metric: "Grammar & Language",
      score: 99,
      description: "Advanced NLP ensures perfect grammar and natural language flow"
    },
    {
      metric: "Content Relevance", 
      score: 96,
      description: "AI matches content to specific program requirements and university culture"
    },
    {
      metric: "Personalization",
      score: 94,
      description: "Unique narratives crafted from individual backgrounds and experiences"
    },
    {
      metric: "Structure & Format",
      score: 98,
      description: "Follows academic standards and admission committee preferences"
    },
    {
      metric: "Authenticity",
      score: 97,
      description: "Maintains genuine voice while highlighting key achievements"
    }
  ];

  const certifications = [
    "SOC 2 Type II Certified",
    "GDPR Compliant",
    "ISO 27001 Certified",
    "Educational Technology Standards"
  ];

  return (
    <section id="accuracy" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Proven Accuracy & Results
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform delivers consistently high-quality results backed by 
            rigorous testing and real-world success stories.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-card bg-gradient-card text-center hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-pastel-blue rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="font-semibold text-foreground mb-2">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Accuracy Metrics */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">Quality Metrics</h3>
            <div className="space-y-6">
              {accuracyMetrics.map((metric, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{metric.metric}</span>
                    <span className="text-primary font-bold">{metric.score}%</span>
                  </div>
                  <Progress value={metric.score} className="h-2" />
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Trust */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">Trust & Security</h3>
            <Card className="border-0 shadow-card bg-gradient-card mb-8">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg text-foreground mb-4">Our Certifications</h4>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card bg-gradient-card">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg text-foreground mb-4">Why Universities Trust Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-pastel-green rounded p-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Authentic Content</p>
                      <p className="text-sm text-muted-foreground">Every SOP reflects genuine student experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-pastel-green rounded p-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Academic Standards</p>
                      <p className="text-sm text-muted-foreground">Meets all academic writing requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-pastel-green rounded p-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Plagiarism-Free</p>
                      <p className="text-sm text-muted-foreground">100% original content guaranteed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}