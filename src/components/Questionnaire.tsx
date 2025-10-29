import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { AppFormData } from "@/types/types";
import { 
  GraduationCap, 
  Briefcase, 
  Lightbulb, 
  Heart, 
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface Props {
  formData: AppFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppFormData>>;
  onComplete: (answers: Record<string, string>) => void;
}

// Define your 5 groups of questions with enhanced descriptions
const QUESTION_GROUPS: Array<{
  title: string;
  items: { key: string; label: string }[];
}> = [
  {
    title: "Academic Background",
    items: [
      { key: "ugMajor", label: "Undergraduate major and institution" },
      { key: "impactCourses", label: "Most impactful courses/projects" },
      { key: "honors", label: "Honors, awards, or scholarships" },
    ],
  },
  {
    title: "Professional Experience",
    items: [
      { key: "roleSummary", label: "Significant internship/job role" },
      { key: "challenges", label: "Challenges tackled & solutions" },
      { key: "teamwork", label: "Teamwork or leadership example" },
    ],
  },
  {
    title: "Research & Projects",
    items: [
      { key: "proudProject", label: "Project you’re most proud of" },
      { key: "yourContribution", label: "Your specific contribution" },
      { key: "skillsDeveloped", label: "Technical/research skills gained" },
    ],
  },
  {
    title: "Motivation & Fit",
    items: [
      { key: "extraCurricular", label: "Clubs/competitions/volunteering" },
      { key: "leadershipRoles", label: "Leadership roles outside academics" },
      { key: "whyCourse", label: "Why this course?" },
      { key: "backgroundFit", label: "How your background prepares you" },
      { key: "uniquePerspective", label: "Unique perspective you bring" },
      { key: "whyUniversity", label: "Why this university?" },
      {
        key: "researchAttraction",
        label: "Faculty/research/groups that appeal",
      },
      {
        key: "communityEngagement",
        label: "How you’ll engage campus community",
      },
    ],
  },
  {
    title: "Goals & Reflection",
    items: [
      { key: "shortTermGoals", label: "Short-term career objectives" },
      { key: "longTermImpact", label: "Long-term impact aspirations" },
      { key: "programBenefits", label: "How program helps goals" },
      { key: "strengths", label: "Core strengths and values" },
      { key: "resilience", label: "Example of resilience/adaptability" },
      { key: "intlExperience", label: "International/cultural experiences" },
      { key: "studyAbroadView", label: "How studying abroad shapes you" },
      { key: "finalReflection", label: "Anything else to highlight?" },
    ],
  },
];

export default function Questionnaire({
  formData,
  setFormData,
  onComplete,
}: Props) {
  const [subStep, setSubStep] = useState(0);

  const group = QUESTION_GROUPS[subStep];
  const total = QUESTION_GROUPS.length;

  // Check completion of current group
  const isComplete = group.items.every(({ key }) => {
    const value = formData[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  const buildAnswersMap = () => {
    const out: Record<string, string> = {};
    QUESTION_GROUPS.forEach(({ items }) => {
      items.forEach(({ key, label }) => {
        const val = formData[key];
        out[label] = typeof val === "string" ? val : "";
      });
    });
    return out;
  };

  // Get icon for each section
  const getSectionIcon = (index: number) => {
    const icons = [GraduationCap, Briefcase, Lightbulb, Heart, Target];
    const IconComponent = icons[index] || Target;
    return IconComponent;
  };

  const getSectionColor = (index: number) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-green-500 to-emerald-600", 
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600",
      "from-teal-500 to-cyan-600"
    ];
    return colors[index] || "from-gray-500 to-gray-600";
  };

  const getSectionBg = (index: number) => {
    const backgrounds = [
      "from-blue-50 to-indigo-50",
      "from-green-50 to-emerald-50",
      "from-purple-50 to-pink-50", 
      "from-orange-50 to-red-50",
      "from-teal-50 to-cyan-50"
    ];
    return backgrounds[index] || "from-gray-50 to-gray-100";
  };

  const getSectionBorder = (index: number) => {
    const borders = [
      "border-blue-200",
      "border-green-200",
      "border-purple-200",
      "border-orange-200", 
      "border-teal-200"
    ];
    return borders[index] || "border-gray-200";
  };

  const IconComponent = getSectionIcon(subStep);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Enhanced Progress Stepper */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 sm:space-x-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          {QUESTION_GROUPS.map((group, i) => (
            <div key={i} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: i === subStep ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  i === subStep
                    ? `bg-gradient-to-r ${getSectionColor(i)} text-white shadow-lg`
                    : i < subStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < subStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-bold">{i + 1}</span>
                )}
              </motion.div>
              {i < QUESTION_GROUPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-2 transition-colors duration-300 ${
                  i < subStep ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <motion.div
        key={subStep}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gradient-to-r ${getSectionBg(subStep)} rounded-2xl p-6 border ${getSectionBorder(subStep)}`}
      >
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${getSectionColor(subStep)} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800">{group.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Step {subStep + 1} of {total}</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className={`bg-gradient-to-r ${getSectionColor(subStep)} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((subStep + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Questions Container */}
      <motion.div
        key={`questions-${subStep}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {group.items.map(({ key, label }, index) => {
          const isAnswered = typeof formData[key] === "string" && formData[key].trim().length > 0;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-200 ${
                  isAnswered 
                    ? `bg-gradient-to-r ${getSectionColor(subStep)} text-white` 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {isAnswered ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <Label htmlFor={key} className="text-base font-semibold text-gray-800 leading-relaxed block">
                    {label}
                  </Label>
                  <Textarea
                    id={key}
                    placeholder="Share your detailed thoughts and experiences here..."
                    value={typeof formData[key] === "string" ? formData[key] : ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className={`min-h-32 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white resize-none ${
                      isAnswered 
                        ? "border-green-300 focus:border-green-500" 
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    rows={4}
                  />
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center text-green-600 text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Answer provided
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4"
      >
        <Button
          variant="outline"
          disabled={subStep === 0}
          onClick={() => setSubStep(subStep - 1)}
          className="rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Section
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">
            {group.items.filter(({ key }) => {
              const value = formData[key];
              return typeof value === "string" && value.trim().length > 0;
            }).length} of {group.items.length} questions answered
          </p>
          <div className="flex space-x-1">
            {group.items.map(({ key }, i) => {
              const isAnswered = typeof formData[key] === "string" && formData[key].trim().length > 0;
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    isAnswered ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {subStep < total - 1 ? (
          <Button
            onClick={() => isComplete && setSubStep(subStep + 1)}
            disabled={!isComplete}
            className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 w-full sm:w-auto ${
              isComplete 
                ? `bg-gradient-to-r ${getSectionColor(subStep)} hover:opacity-90 text-white shadow-lg` 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next Section
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!isComplete) return;
              const answers = buildAnswersMap();
              onComplete(answers);
            }}
            disabled={!isComplete}
            className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 w-full sm:w-auto ${
              isComplete 
                ? `bg-gradient-to-r ${getSectionColor(subStep)} hover:opacity-90 text-white shadow-lg` 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete & Continue
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
