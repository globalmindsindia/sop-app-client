import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SOPStep1Video from "@/assets/SOP_Step_1.mov";
import SOPStep2Video from "@/assets/SOP_Step_2.mov";
import SOPStep3Video from "@/assets/SOP_Step_3.mov";
import SOPStep4Video from "@/assets/SOP_Step_4.mov";
import SOPStep5Video from "@/assets/SOP_Step_5.mov";
import SOPStep6Video from "@/assets/SOP_Step_6.mov";
import SOPStep7Video from "@/assets/SOP_Step_7.mov";

interface HeroProps {
  onGetStarted: () => void;
}

const steps = [
  { label: "1. Personal Info", video: SOPStep1Video },
  { label: "2. Resume Upload", video: SOPStep2Video },
  { label: "3. Questionnaires", video: SOPStep3Video },
  { label: "4. Review & Edit", video: SOPStep4Video },
  { label: "5. Quality Check", video: SOPStep5Video },
  { label: "6. Payment", video: SOPStep6Video },
  { label: "7. SOP Ready", video: SOPStep7Video },
];

export default function Hero({ onGetStarted }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] py-8 sm:py-12 md:py-16 lg:py-20 xl:py-28">
      <div className="container-app">
        {/* RESPONSIVE GRID - Mobile: 1 col, Tablet+: 2 cols */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          {/* LEFT SIDE — CONTENT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border shadow-sm"
            >
              <span className="text-primary">SOP Generator</span>
            </motion.div>

            {/* Title - Responsive Font Sizes */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight text-foreground"
            >
              Craft Your Perfect{" "}
              <span className="text-primary">Statement of Purpose</span>
            </motion.h1>

            {/* Subtitle - Responsive Typography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-body text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              Transform your dreams into compelling narratives. Our SOP
              generator creates personalized, professional statements that truly
              stand out.
            </motion.p>

            {/* Buttons - Stack on mobile, Row on tablet+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                Start Building Your Future
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 w-full sm:w-auto"
                onClick={() =>
                  document
                    .querySelector("#features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE — VIDEO SECTION */}
          <div className="space-y-4 sm:space-y-6 w-full order-1 lg:order-2">
            {/* Tabs - Responsive Layout */}
            <div className="w-full bg-primary rounded-lg p-1 flex flex-wrap sm:flex-nowrap gap-1 shadow-lg transition-all duration-300">
              {steps.map((step, idx) => {
                const active = activeIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 flex items-center justify-center rounded text-xs sm:text-sm font-medium transition leading-tight whitespace-nowrap
              ${
                active
                  ? "bg-card text-foreground shadow-md"
                  : "text-primary-foreground/90 hover:text-primary-foreground"
              }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>

            {/* Video Container - Responsive Aspect Ratio */}
            <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-muted bg-card">
              <video
                src={steps[activeIndex].video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: "scale(1.1)",
                  objectPosition: "center center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
