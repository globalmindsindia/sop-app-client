import { useEffect, useRef, useState } from "react";
import {
  University,
  Upload,
  MessageSquare,
  Sparkles,
  CheckCircle,
  CreditCard,
  FileText,
} from "lucide-react";
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
    title: "SOP Ready",
    desc: "Receive your professionally crafted SOP within 2 working days.",
    color: "#38BDF8",
    border: "border-[#38BDF8]",
    circle: "bg-[#38BDF8]",
    text: "text-[#38BDF8]",
  },
];

function FallbackIcon({ id, className }: { id: number; className?: string }) {
  if (id === 1) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
      >
        <path d="M12 2L1 7l11 5 9-4.09V17" />
        <path d="M7 14v4a4 4 0 0 0 8 0v-4" />
      </svg>
    );
  } else if (id === 4) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
      >
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        <path d="M5 20l.8-2.4L8.2 16 5.8 15 5 12 3.5 15 1 16l2.5 1 1.5 2.4z" />
      </svg>
    );
  } else {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
      >
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
      const wrapperX =
        stepsWrapperRef.current?.getBoundingClientRect().left || 0;
      setNumberCenters(
        numberRefs.current.map((ref) => {
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
      const wrapperY =
        stepsWrapperRefMobile.current?.getBoundingClientRect().top || 0;
      const lineLeft =
        stepsWrapperRefMobile.current
          ?.querySelector(".mobile-timeline-bar")
          ?.getBoundingClientRect().left || 0;
      setNumberTopsMobile(
        numberRefsMobile.current.map((ref) => {
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
    <section
      id="how-it-works"
      className="relative py-14 overflow-x-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))]"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-background" />

      {/* ✅ GLOBAL CONTAINER */}
      <div className="container-app relative z-10">
        {/* ================= TITLE ================= */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            How It <span className="text-primary">Works</span>
          </h2>

          <p className="font-body text-lg sm:text-xl text-muted-foreground max-w-xl">
            Our streamlined process makes creating your perfect{" "}
            <span className="text-primary font-semibold">SOP</span> stress-free.
          </p>

          <p className="font-body text-base mt-2 text-muted-foreground">
            Follow these{" "}
            <span className="text-primary font-semibold">7 easy steps</span> to
            get started.
          </p>
        </div>

        {/* ================= MOBILE ================= */}
        <div
          className="md:hidden relative w-full overflow-x-hidden"
          ref={stepsWrapperRefMobile}
        >
          {/* Timeline */}
          <div className="absolute left-4 top-8 bottom-8 w-[3px] bg-primary rounded-full" />

          {showPlane && numberTopsMobile.length === steps.length && (
            <img
              src={airplaneImg}
              alt="Airplane"
              className="absolute z-30 transition-all duration-700 pointer-events-none"
              style={{
                left: 4,
                top: numberTopsMobile[planeStep] - airplaneH / 2,
                width: airplaneW,
                height: airplaneH,
                transform: "rotate(90deg)",
              }}
            />
          )}

          <div className="flex flex-col gap-10 relative z-10 pl-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex gap-4 items-start">
                  <div
                    ref={(el) => (numberRefsMobile.current[i] = el)}
                    className="z-10"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary border-4 border-white shadow-md flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 max-w-[18rem] bg-card border border-muted shadow-lg rounded-2xl p-4">
                    {Icon ? (
                      <Icon className="h-7 w-7 text-primary mb-2" />
                    ) : (
                      <FallbackIcon
                        id={step.num}
                        className="h-7 w-7 text-primary mb-2"
                      />
                    )}

                    <span className="font-heading font-bold uppercase text-primary text-sm">
                      Step {step.num}
                    </span>

                    <h3 className="font-heading font-bold text-foreground text-base mt-1">
                      {step.title}
                    </h3>

                    <p className="font-body text-muted-foreground text-sm mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= DESKTOP VERSION ================= */}
        <div
          className="hidden md:block relative w-full overflow-x-hidden"
          style={{ height: sectionHeight }}
        >
          {/* Timeline */}
          <div
            className="absolute left-0 right-0 mx-auto h-1 bg-primary rounded-full"
            style={{ top: timelineY }}
          />

          {/* Airplane */}
          {showPlane && numberCenters.length === steps.length && (
            <img
              src={airplaneImg}
              alt="Airplane"
              className="absolute z-30 transition-all duration-700 pointer-events-none"
              style={{
                top: timelineY - airplaneH / 2,
                left: numberCenters[planeStep] - airplaneW / 2,
                width: airplaneW,
                height: airplaneH,
              }}
            />
          )}

          {/* Steps */}
          <div
            ref={stepsWrapperRef}
            className="relative flex w-full justify-between"
            style={{ height: sectionHeight }}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isAbove = idx % 2 === 0;

              const cardTop = isAbove
                ? timelineY - cardHeight - 64
                : timelineY + 64;

              return (
                <div
                  key={step.num}
                  className="relative flex-1 flex justify-center"
                >
                  {/* Dotted Line */}
                  <div
                    className="absolute border-l-2 border-dashed"
                    style={{
                      top: isAbove ? timelineY - 48 : timelineY + 40,
                      height: 48,
                      borderColor: "hsl(var(--primary))",
                    }}
                  />

                  {/* Number */}
                  <div
                    ref={(el) => (numberRefs.current[idx] = el)}
                    className="absolute z-20"
                    style={{ top: timelineY - 20 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary border-4 border-white shadow-md flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="absolute"
                    style={{
                      top: cardTop,
                      width: cardWidth,
                      height: cardHeight,
                    }}
                  >
                    <div className="rounded-3xl p-6 bg-card shadow-xl border border-muted w-full h-full flex flex-col items-center justify-center">
                      {Icon ? (
                        <Icon className="h-7 w-7 text-primary mb-2" />
                      ) : (
                        <FallbackIcon
                          id={step.num}
                          className="h-7 w-7 text-primary mb-2"
                        />
                      )}

                      <span className="font-heading font-bold uppercase tracking-widest text-primary">
                        Step {step.num}
                      </span>

                      <h3 className="font-heading font-bold text-base text-foreground mt-2 text-center">
                        {step.title}
                      </h3>

                      <p className="font-body text-muted-foreground text-sm mt-1 text-center leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
