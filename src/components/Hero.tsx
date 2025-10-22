import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

const steps = [
  {
    label: "1. Personal Info",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    label: "2. Resume Upload",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    label: "3. Questionnaires",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    label: "4. Quality Check",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  { label: "5. Payment", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  {
    label: "6. Thank You",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export default function Hero({ onGetStarted }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Intro & CTA */}
        <div className="space-y-8">
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
        <div className="space-y-6">
          {/* Tabs */}
          <div className="bg-green-800 rounded-lg p-1 flex space-x-1">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 py-2 px-4 text-center rounded text-sm font-medium transition ${
                  activeIndex === idx
                    ? "bg-green-500 text-white shadow-md"
                    : "text-white hover:bg-green-700"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Video */}
          <video
            src={steps[activeIndex].video}
            autoPlay
            loop
            muted
            className="w-full rounded-xl shadow-lg border-2 border-gray-200"
          />
        </div>
      </div>
    </section>
  );
}
