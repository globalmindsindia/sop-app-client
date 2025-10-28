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

  const { imgWidth, imgHeight, radius, cardWidth, cardWidthPx, marginTop } = responsive;

  const features = [
    {
      icon: Sparkles,
      title: "Smart Writing",
      description: "Our team crafts compelling, personalized statements reflecting your unique story.",
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
      description: "Content tailored for specific programs and university expectations.",
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
      description: "Reviewed by experienced professionals, based on thousands of successes.",
      color: "from-yellow-100 to-amber-50",
    },
    {
      icon: Trophy,
      title: "Proven Success",
      description: "95% of users report improved outcomes and acceptance rates.",
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
      description: "Supports applications worldwide with region-specific formatting.",
      color: "from-fuchsia-100 to-indigo-50",
    },
  ];

  return (
    <section
      className="pt-6 md:pt-8 pb-1 md:pb-0 bg-gradient-to-br from-blue-100 via-white to-blue-50 relative"
      // style={{
      //   backgroundImage: 'url(/src/assets/SOP_Background.jpg)',
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      // }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 md:mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-2 md:mb-2">
            Why Choose SOP Generator?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-600/80 max-w-3xl mx-auto font-medium px-4">
            We combine cutting-edge technology with deep admission process expertise to help your application stand out.
          </p>
        </div>
        <div
          className={`relative flex justify-center items-center ${marginTop} md:mt-0 overflow-visible`}
          style={{
            minHeight: `${Math.max(imgHeight + radius * 2 - (imgWidth > 200 ? 500 : 0), 220)}px`,
          }}
        >
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
          <div
            className="absolute inset-0 animate-spin"
            style={{
              animationDuration: "20s",
            }}
          >
            {features.map((feature, idx) => {
              const angle = ((2 * Math.PI) / features.length) * idx - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isOpen = openIndex === idx;
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={
                    `absolute flex flex-col items-center p-0 border-0 transition-all ${cardWidth} group focus:outline-none` +
                    (isOpen ? " z-30" : " z-20")
                  }
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    background: "none",
                    width: `${cardWidthPx}px`,
                  }}
                  tabIndex={0}
                >
                  <div
                    className={
                      // hover:scale-105 was removed below!
                      `w-full rounded-lg md:rounded-2xl shadow-xl px-1 md:px-4 py-2 md:py-5 select-none bg-gradient-to-br ${feature.color} border border-blue-100 duration-200 animate-spin`
                    }
                    style={{
                      animationDuration: "20s",
                      animationDirection: "reverse",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-white mb-1 md:mb-2 p-0.5 md:p-2 shadow">
                        <feature.icon className="h-3 w-3 md:h-8 md:w-8 text-blue-700" />
                      </div>
                      <div className="text-xs md:text-base font-bold text-blue-900 text-center leading-tight md:leading-normal">{feature.title}</div>
                      {isOpen && (
                        <div className="text-xs mt-1 md:mt-2 text-blue-800 font-medium text-center transition-all">
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
