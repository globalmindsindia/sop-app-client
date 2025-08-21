import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      program: "MS Computer Science",
      university: "Stanford University",
      rating: 5,
      content: "SOP Buddy helped me craft a compelling narrative that got me into my dream program at Stanford. The AI understood my background and created something truly personal.",
      image: "SC",
      country: "🇺🇸 USA"
    },
    {
      name: "Rajesh Patel",
      program: "MBA",
      university: "Harvard Business School",
      rating: 5,
      content: "I was struggling with writer's block for weeks. SOP Buddy generated my SOP in minutes and it was better than anything I could have written myself. Highly recommended!",
      image: "RP",
      country: "🇮🇳 India"
    },
    {
      name: "Maria Rodriguez",
      program: "PhD Psychology",
      university: "Oxford University",
      rating: 5,
      content: "The level of personalization was incredible. It felt like the AI truly understood my research interests and career goals. Got accepted on my first try!",
      image: "MR",
      country: "🇪🇸 Spain"
    },
    {
      name: "David Kim",
      program: "MS Engineering",
      university: "MIT",
      rating: 5,
      content: "As a non-native English speaker, I was worried about my writing. SOP Buddy created a polished, professional SOP that impressed the admissions committee.",
      image: "DK",
      country: "🇰🇷 South Korea"
    },
    {
      name: "Emma Thompson",
      program: "MS Data Science",
      university: "UC Berkeley",
      rating: 5,
      content: "The turnaround time was amazing. I needed my SOP urgently for an early application deadline, and SOP Buddy delivered quality content in minutes.",
      image: "ET",
      country: "🇬🇧 UK"
    },
    {
      name: "Ahmed Hassan",
      program: "MS Finance",
      university: "London School of Economics",
      rating: 5,
      content: "SOP Buddy understood the nuances of my field and created content that perfectly aligned with LSE's expectations. The investment was worth every penny.",
      image: "AH",
      country: "🇪🇬 Egypt"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from students who achieved their dreams with SOP Buddy. 
            Join thousands of successful applicants worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card bg-gradient-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.country}</p>
                  </div>
                  <Quote className="h-6 w-6 text-primary opacity-30" />
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="border-t border-border pt-4">
                  <p className="text-xs font-medium text-primary">{testimonial.program}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <p className="text-sm text-muted-foreground">Successful Applications</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">200+</div>
              <p className="text-sm text-muted-foreground">Universities Worldwide</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}