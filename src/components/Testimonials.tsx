import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const testimonials = [
    {
      name: "Sandhya Venaktesh",
      rating: 5,
      content: "I can confidently say that Global Minds India's SOP Creator was a total game-changer for my university application! I was initially nervous about writing my Statement of Purpose, but the tool made everything so simple and structured. It guided me step-by-step, helped me express my story authentically, and ensured my SOP matched my chosen program perfectly. Within hours, I had a professional, impactful SOP — and it played a huge role in securing my admission! Highly recommend this to every student aiming to study abroad!",
      image: "SC"
    },
    {
      name: "Preethi Elango",
      rating: 5,
      content: "I had a great experience getting my SOP prepared here. The team was very professional and took the time to understand my background and goals before drafting. They presented my profile in a very clear and compelling manner, highlighting my strengths perfectly. The communication was smooth, and they were always open to feedback and revisions. Thanks to their guidance, I now feel confident submitting my application. Highly recommended for anyone looking for quality SOP writing support!",
      image: "RP"
    },
    {
      name: "Rachana",
      rating: 5,
      content: "Writing my SOP felt overwhelming at first, but Global Minds India’s SOP Creator completely changed the game! The platform was super easy to use and helped me organize my thoughts beautifully. I loved how it gave personalized prompts that made my SOP sound genuinely ‘me’. Thanks to this, my final draft was both professional and heartfelt — and it truly impressed my university reviewers. I couldn’t have done it this smoothly without Global Minds India!",
      image: "MR"
    },
    {
      name: "Ujwal",
      rating: 5,
      content: "Global Minds India’s SOP Creator made my entire application journey effortless! I was amazed at how the tool helped me frame my goals and experiences in such a clear, powerful way. It saved me so much time and removed all the guesswork from SOP writing. The end result was a polished, impactful statement that perfectly reflected my ambitions — and it helped me secure my dream admit. Truly one of the best tools for study abroad aspirants!",
      image: "DK"
    },
    {
      name: "Amogh JS",
      rating: 5,
      content: "I had a wonderful experience getting my SOP written here. The team was highly professional and took genuine interest in understanding my goals and background. They crafted a well-structured and impactful SOP that highlighted my strengths beautifully. Communication was smooth, and they were always open to revisions and feedback. Their expertise gave me great confidence in my application — truly a service I’d recommend to anyone seeking a standout SOP!",
      image: "ET"
    },
    {
      name: "Shashank S",
      rating: 5,
      content: "My experience with the SOP writing team was truly exceptional. They invested time to learn about my journey, ambitions, and achievements before creating a personalized and powerful SOP. The final version was thoughtful, engaging, and perfectly aligned with my academic goals. I really appreciated their prompt responses and willingness to refine every detail. Their guidance made my application process so much easier and more confident — a top-notch service I’d gladly recommend!",
      image: "AH"
    }
  ];

  const testimonialsLength = testimonials.length;
  const fullTestimonials = [...testimonials, ...testimonials];
  const numVisible = 3;
  const slideWidth = 100 / numVisible;
  const gapRem = '1.5rem';
  const step = `calc(33.333% + ${gapRem})`;
  const cardBasis = `calc(33.333% - 1rem)`;

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev < testimonialsLength - 1) {
        return prev + 1;
      } else {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(0);
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        }, 500);
        return testimonialsLength;
      }
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

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
            Real stories from students who achieved their dreams with expert guidance. Join hundreds of successful applicants worldwide.
          </p>
        </div>

        <div className="relative overflow-hidden mb-16">
          <div 
            className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : 'transition-none'}`}
            style={{ transform: `translateX(calc(-${currentIndex} * ${step}))` }}
          >
            {fullTestimonials.map((testimonial, index) => (
              <div key={`${testimonial.name}-${index}`} className="flex-shrink-0" style={{ flexBasis: cardBasis }}>
                <Card className="border-0 shadow-card bg-gradient-card h-full w-full hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {testimonial.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      </div>
                      <Quote className="h-6 w-6 text-primary opacity-30 flex-shrink-0" />
                    </div>

                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic line-clamp-4">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 z-10"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 z-10"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <p className="text-sm text-muted-foreground">Successful Applications</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">100+</div>
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