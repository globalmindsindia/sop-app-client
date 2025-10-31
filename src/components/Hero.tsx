import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

const steps: Array<{ label: string | JSX.Element; video: string }> = [
  {
    label: "1. Personal Info",
    video: SOPStep1Video,
  },
  {
    label: "2. Resume Upload",
    video:  SOPStep2Video,
  },
  {
    label: "3. Questionnaires",
    video: SOPStep3Video,
  },
  {
    label: "4. Review & Edit",
    video: SOPStep4Video,
  },
  {
    label: "5. Quality Check",
    video: SOPStep5Video,
  },
  {
    label: "6. Payment",
    video: SOPStep6Video,
      
  },
  {
    label: (
      <div className="flex flex-col items-center">
        <span>7. SOP</span>
        <span>Ready</span>
      </div>
    ),
    video: SOPStep7Video,
  },
];

export default function Hero({ onGetStarted }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 py-28 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Intro & CTA */}
        <div className="space-y-8 md:ml-8 lg:ml-12">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Craft Your Perfect{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Statement of Purpose
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-lg leading-relaxed">
            Transform your dreams into compelling narratives. Our SOP generator
            creates personalized, professional statements that stand out.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="inline-flex items-center rounded-2xl px-8 py-4 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Start Building Your Future
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Right: Tabs above Video & Features */}
        <div className="space-y-6 w-full max-w-3xl">
          {/* Tabs */}
          <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-lg p-1 flex space-x-1 shadow-lg transition-colors duration-300">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 py-3 px-2 flex items-center justify-center rounded text-sm font-medium transition bg-white bg-clip-text text-transparent leading-tight ${
                  activeIndex === idx
                    ? "bg-gradient-to-r from-white to-gray-100 text-gray-800 shadow-md"
                    : "text-white hover:opacity-90"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Video */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
            <video
              src={steps[activeIndex].video}
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: 'scale(1.1)',
                objectPosition: 'center center'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
