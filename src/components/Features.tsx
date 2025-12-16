import { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Target,
  Shield,
  Users,
  Trophy,
  BookOpen,
  CheckCircle,
  Globe,
} from "lucide-react";
import whyChooseUsImg from "../assets/Why_choose_us.png";
import sopBackgroundImg from "../assets/SOP_Background.jpg";

export default function Features() {
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  // Responsive sizing based on screen size
  const [responsive, setResponsive] = useState({
    imgWidth: 100,
    imgHeight: 150,
    radius: 60,
    cardWidth: "w-12",
    cardWidthPx: 48,
    marginTop: "-mt-8",
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) {
        const cardW = 72;
        const r = Math.max(30, (width - cardW) / 2 - 10);
        setResponsive({
          imgWidth: 90,
          imgHeight: 120,
          radius: r,
          cardWidth: "w-20",
          cardWidthPx: cardW,
          marginTop: "-mt-2",
        });
      } else if (width < 768) {
        setResponsive({
          imgWidth: 300,
          imgHeight: 430,
          radius: 250,
          cardWidth: "w-40",
          cardWidthPx: 160,
          marginTop: "-mt-32",
        });
      } else if (width < 1024) {
        setResponsive({
          imgWidth: 400,
          imgHeight: 580,
          radius: 320,
          cardWidth: "w-48",
          cardWidthPx: 192,
          marginTop: "-mt-40",
        });
      } else {
        setResponsive({
          imgWidth: 540,
          imgHeight: 780,
          radius: 470,
          cardWidth: "w-56",
          cardWidthPx: 224,
          marginTop: "-mt-40",
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { imgWidth, imgHeight, radius, cardWidth, cardWidthPx, marginTop } =
    responsive;

  const features = [
    {
      icon: Sparkles,
      title: "Smart Writing",
      description:
        "Our team crafts compelling, personalized statements reflecting your unique story.",
      color: "from-indigo-200 to-blue-100",
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Get your SOP ready in 1–2 days—no endless waiting.",
      color: "from-cyan-100 to-blue-50",
    },
    {
      icon: Target,
      title: "University-Specific",
      description:
        "Content tailored for specific programs and university expectations.",
      color: "from-rose-100 to-pink-50",
    },
    {
      icon: Shield,
      title: "100% Original",
      description: "Every SOP is generated from scratch for authenticity.",
      color: "from-green-100 to-lime-50",
    },
    {
      icon: Users,
      title: "Expert-Reviewed",
      description:
        "Reviewed by experienced professionals, based on thousands of successes.",
      color: "from-yellow-100 to-amber-50",
    },
    {
      icon: Trophy,
      title: "Proven Success",
      description:
        "95% of users report improved outcomes and acceptance rates.",
      color: "from-orange-100 to-yellow-50",
    },
    {
      icon: BookOpen,
      title: "Multiple Formats",
      description: "Create SOPs for MS, PhD, MBA, and more.",
      color: "from-sky-100 to-purple-50",
    },
    {
      icon: CheckCircle,
      title: "Grammar Perfect",
      description: "Built-in grammar and style checks ensure polish.",
      color: "from-emerald-100 to-lime-50",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Supports applications worldwide with region-specific formatting.",
      color: "from-fuchsia-100 to-indigo-50",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))]"
    >
      {/* Soft overlay just like reference hero */}
      <div className="absolute inset-0 bg-background"></div>

      <div className="container-app relative z-10">
        {/* TITLE BLOCK — MATCHED EXACTLY */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
            Why Choose <span className="text-primary">SOP Generator?</span>
          </h2>

          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with deep admissions expertise to
            help your application stand out.
          </p>
        </div>

        {/* ORBIT SECTION */}
        <div
          className={`relative flex justify-center items-center ${marginTop} md:mt-0 overflow-visible`}
          style={{
            minHeight: `${Math.max(
              imgHeight + radius * 2 - (imgWidth > 200 ? 500 : 0),
              220
            )}px`,
          }}
        >
          {/* Center Image */}
          <img
            src={whyChooseUsImg}
            alt="Expert"
            className="absolute left-1/2 top-1/2 z-10 max-w-full max-h-full"
            style={{
              width: `${imgWidth}px`,
              height: `${imgHeight}px`,
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />

          {/* Orbiting Cards */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "20s" }}
          >
            {features.map((feature, idx) => {
              const angle =
                ((2 * Math.PI) / features.length) * idx - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isOpen = openIndex === idx;

              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={`absolute flex flex-col items-center transition-all group ${
                    isOpen ? "z-30" : "z-20"
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    width: `${cardWidthPx}px`,
                    background: "none",
                  }}
                >
                  {/* CARD */}
                  <div
                    className={`
                    w-full rounded-xl md:rounded-2xl shadow-xl 
                    px-3 md:px-4 py-3 md:py-5 
                    bg-card border border-muted 
                    transition-all 
                    animate-spin
                  `}
                    style={{
                      animationDuration: "20s",
                      animationDirection: "reverse",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      {/* ICON */}
                      <div className="rounded-full bg-primary/10 mb-2 p-2 shadow-sm">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>

                      {/* TITLE */}
                      <div className="text-sm md:text-base font-heading font-bold text-foreground text-center">
                        {feature.title}
                      </div>

                      {/* DESCRIPTION */}
                      {isOpen && (
                        <div className="text-xs mt-2 text-muted-foreground font-body text-center">
                          {feature.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
