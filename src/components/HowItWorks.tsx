import { useEffect, useRef, useState } from "react";
import { University, Upload, MessageSquare, Sparkles, CheckCircle, CreditCard, FileText } from "lucide-react";
import airplaneImg from "../assets/airplane.png";

const steps = [
  {
    num: 1,
    icon: University,
    title: "Personal Info",
    desc: "Provide your basic personal details to get started.",
    color: "#F26AAC",
    border: "border-[#F26AAC]",
    circle: "bg-[#F26AAC]",
    text: "text-[#F26AAC]",
  },
  {
    num: 2,
    icon: Upload,
    title: "Resume",
    desc: "Upload your up-to-date resume highlighting your academic and professional achievements.",
    color: "#FFD33F",
    border: "border-[#FFD33F]",
    circle: "bg-[#FFD33F]",
    text: "text-[#FFD33F]",
  },
  {
    num: 3,
    icon: MessageSquare,
    title: "Questionnaire",
    desc: "Answer key questions about your motivations, experiences, and aspirations.",
    color: "#51A8EF",
    border: "border-[#51A8EF]",
    circle: "bg-[#51A8EF]",
    text: "text-[#51A8EF]",
  },
  {
  num: 4,
  icon: CheckCircle,
  title: "Answer Review",
  desc: "Review your responses to ensure all questions are answered accurately before submission.",
  color: "#A369DB",
  border: "border-[#A369DB]",
  circle: "bg-[#A369DB]",
  text: "text-[#A369DB]",
},
{
  num: 5,
  icon: Sparkles,
  title: "Quality Check",
  desc: "System automatically checks your responses for accuracy and completeness.",
  color: "#38CE88",
  border: "border-[#38CE88]",
  circle: "bg-[#38CE88]",
  text: "text-[#38CE88]",
},

  
  {
    num: 6,
    icon: CreditCard,
    title: "Payment",
    desc: "Complete your payment securely to proceed with the final SOP preparation.",
    color: "#FF8C00",
    border: "border-[#FF8C00]",
    circle: "bg-[#FF8C00]",
    text: "text-[#FF8C00]",
  },
  {
  num: 7,
  icon: FileText,
  title: "SOP",
  desc: "Your professionally crafted SOP is drafted and emailed to you to start your study abroad journey.",
  color: "#38BDF8",
  border: "border-[#38BDF8]",
  circle: "bg-[#38BDF8]",
  text: "text-[#38BDF8]",
}

];

function FallbackIcon({ id, className }: { id: number; className?: string }) {
  if (id === 1) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        <path d="M12 2L1 7l11 5 9-4.09V17" />
        <path d="M7 14v4a4 4 0 0 0 8 0v-4" />
      </svg>
    );
  } else if (id === 4) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        <path d="M5 20l.8-2.4L8.2 16 5.8 15 5 12 3.5 15 1 16l2.5 1 1.5 2.4z" />
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        <path d="M12 2l3 6 6 .5-4.5 3.5L18 20l-6-3-6 3 1.5-7L3 8.5 9 8z" />
      </svg>
    );
  }
}

export default function HowItWorks() {
  // layout values
  const sectionHeight = 700;
  const timelineY = sectionHeight / 2;
  const cardWidth = 240;
  const cardHeight = 240;
  const gap = 36;
  const dottedLength = 32;
  const numSize = 40;
  const airplaneW = 80;
  const airplaneH = 80;
  const numHalf = numSize / 2;

  // States/refs for animation
  const [planeStep, setPlaneStep] = useState(0);
  const [showPlane, setShowPlane] = useState(true);
  const numberRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numberRefsMobile = useRef<Array<HTMLDivElement | null>>([]);
  const stepsWrapperRef = useRef<HTMLDivElement | null>(null);
  const stepsWrapperRefMobile = useRef<HTMLDivElement | null>(null);
  const [numberCenters, setNumberCenters] = useState<number[]>([]);
  const [numberTopsMobile, setNumberTopsMobile] = useState<number[]>([]);
  const [timelineLeftMobile, setTimelineLeftMobile] = useState<number>(0);

  // Desktop (horizontal): airplane stops, centers on circles
  useEffect(() => {
    function updateCenters() {
      if (window.innerWidth < 768) return;
      const wrapperX = stepsWrapperRef.current?.getBoundingClientRect().left || 0;
      setNumberCenters(
        numberRefs.current.map(ref => {
          if (!ref) return 0;
          const box = ref.getBoundingClientRect();
          return box.left - wrapperX + box.width / 2;
        })
      );
    }
    updateCenters();
    window.addEventListener("resize", updateCenters);
    return () => window.removeEventListener("resize", updateCenters);
  }, []);

  // Mobile (vertical): airplane moves down timeline
  useEffect(() => {
    function updateTops() {
      if (window.innerWidth >= 768) return;
      const wrapperY = stepsWrapperRefMobile.current?.getBoundingClientRect().top || 0;
      const lineLeft = stepsWrapperRefMobile.current?.querySelector(".mobile-timeline-bar")?.getBoundingClientRect().left || 0;
      setNumberTopsMobile(
        numberRefsMobile.current.map(ref => {
          if (!ref) return 0;
          const box = ref.getBoundingClientRect();
          return box.top - wrapperY + box.height / 2;
        })
      );
      setTimelineLeftMobile(lineLeft);
    }
    updateTops();
    window.addEventListener("resize", updateTops);
    return () => window.removeEventListener("resize", updateTops);
  }, []);

  useEffect(() => {
    let handle: NodeJS.Timeout;
    handle = setTimeout(() => {
      if (planeStep < steps.length - 1) {
        setShowPlane(true);
        setPlaneStep(planeStep + 1);
      } else {
        setShowPlane(false);
        setTimeout(() => {
          setPlaneStep(0);
          setShowPlane(true);
        }, 400);
      }
    }, 2200);
    return () => clearTimeout(handle);
  }, [planeStep]);

  return (
    <section id="how-it-works" className="py-14 px-2 bg-[#f4f7fa]">
      <div className="max-w-3xl mx-auto flex flex-col items-center mb-10 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-pink-500 to-green-400 bg-clip-text text-transparent drop-shadow mb-2">
          How It Works
        </h2>
        <p className="text-lg sm:text-xl text-gray-800 font-medium">
          Our streamlined process makes creating your perfect <span className="font-semibold text-indigo-600">SOP</span> simple and stress-free.
        </p>
        <p className="text-base mt-2 text-[#5a6072] max-w-md mx-auto">
          Follow these <span className="text-pink-500 font-semibold">7 easy steps</span> to get started.
        </p>
      </div>

      {/* Mobile vertical timeline and airplane */}
      <div className="md:hidden flex flex-col items-center w-full relative" ref={stepsWrapperRefMobile} style={{ minHeight: 700 }}>
        {/* The vertical timeline bar (add class for JS targeting) */}
        <div className="mobile-timeline-bar absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#f26aac] to-[#a369db] z-0" style={{ borderRadius: "2px" }} />
        {/* Airplane on mobile: rotate 90deg, exactly centered on number timeline */}
        {showPlane && numberTopsMobile.length === steps.length &&
          <img
            src={airplaneImg}
            alt="Airplane"
            className="absolute z-30 transition-all duration-700"
            style={{
              left: timelineLeftMobile + 20 - airplaneW / 2-24,
              top: numberTopsMobile[planeStep] - airplaneH / 2,
              width: airplaneW,
              height: airplaneH,
              pointerEvents: "none",
              transform: "rotate(90deg)"
            }}
          />
        }
        <div className="w-full flex flex-col gap-10 relative z-10">
          {steps.map((step, i) => {
            const Icon = (step.icon || null) as any;
            return (
              <div key={step.num} className="flex flex-row items-center gap-4 w-full">
                {/* Timeline circle */}
                <div className="flex flex-col items-center min-w-[56px] z-10">
                  <div ref={el => { numberRefsMobile.current[i] = el; }}
                    className={`rounded-full border-4 border-white w-10 h-10 flex items-center justify-center shadow-md ${step.circle}`}>
                    <span className="text-white font-bold text-base">{step.num}</span>
                  </div>
                </div>
                {/* Card with icon */}
                <div className={`rounded-[1.5rem] p-4 bg-white shadow-md border ${step.border} w-full max-w-xs flex flex-col items-start`}>
                  <div className="mb-2">
                    {Icon ? (
                      <Icon className={`h-7 w-7 ${step.text}`} />
                    ) : (
                      <FallbackIcon id={step.num} className={`h-7 w-7 ${step.text}`} />
                    )}
                  </div>
                  <span className={`font-bold uppercase tracking-widest ${step.text} text-sm mb-1`}>
                    Step {step.num}
                  </span>
                  <h3 className="font-bold text-base text-gray-800 mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-xs">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Desktop Timeline + Airplane --- */}
      <div className="hidden md:block w-full relative z-10 px-8" style={{ height: sectionHeight }}>
        {/* Timeline */}
        <div
          className="absolute left-8 right-8 mx-auto h-1 bg-gradient-to-r from-[#f26aac] to-[#a369db] z-10"
          style={{
            top: timelineY,
            height: "4px",
            borderRadius: "2px"
          }}
        />
        {showPlane && numberCenters.length === steps.length &&
          <img
            src={airplaneImg}
            alt="Airplane"
            className="absolute z-30 transition-all duration-700"
            style={{
              top: timelineY - airplaneH / 2 + 2,
              left: numberCenters[planeStep] + 32 - airplaneW / 2,
              width: airplaneW,
              height: airplaneH,
              pointerEvents: "none"
            }}
          />
        }
        <div
          ref={stepsWrapperRef}
          className="flex flex-row justify-between items-stretch w-full px-8"
          style={{ height: sectionHeight }}
        >
          {steps.map((step, idx) => {
            const isAbove = idx % 2 === 0;
            const numberTop = timelineY - numSize / 2;
            const cardY = isAbove
              ? numberTop - gap - dottedLength - cardHeight
              : numberTop + numSize + gap + dottedLength;
            const dottedTop = isAbove
              ? numberTop - dottedLength
              : numberTop + numSize;
            const Icon = (step.icon || null) as any;

            return (
              <div
                key={step.num}
                className="flex flex-col items-center relative"
                style={{ height: sectionHeight, width: `${100/steps.length}%` }}
              >
                {/* Dotted line */}
                <div
                  className="absolute z-10 border-l-2 border-dashed"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: dottedTop,
                    height: dottedLength,
                    borderColor: step.color,
                    width: 0
                  }}
                />
                {/* Number circle ON the timeline */}
                <div
                  ref={el => { numberRefs.current[idx] = el; }}
                  className="absolute left-1/2 -translate-x-1/2 z-20"
                  style={{ top: numberTop }}
                >
                  <div className={`rounded-full shadow-md border-4 border-white w-10 h-10 flex items-center justify-center ${step.circle}`}>
                    <span className="text-white font-bold text-base">{step.num}</span>
                  </div>
                </div>
                {/* Step card */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ top: cardY, width: cardWidth, height: cardHeight }}
                >
                  <div className={`rounded-[2rem] p-6 bg-white shadow-lg border ${step.border} w-full h-full flex flex-col items-center justify-center`}>
                    {Icon
                      ? <Icon className={`h-7 w-7 ${step.text} mb-2`} />
                      : <FallbackIcon id={step.num} className={`h-7 w-7 ${step.text} mb-2`} />
                    }
                    <span className={`font-bold uppercase mt-1 mb-2 tracking-widest ${step.text}`}>Step {step.num}</span>
                    <h3 className="font-bold text-base text-gray-800 mb-2 text-center">{step.title}</h3>
                    <p className="text-gray-400 text-sm text-center leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
