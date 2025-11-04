import { useState, useEffect } from "react";
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
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// --- Dictionary API Helper ---
// Improved meaningful text validation
async function isMeaningfulSentence(text: string): Promise<boolean> {
  if (!text || text.trim().length < 3) return false;

  // Reject numbers or symbols
  if (!/^[A-Za-z0-9\s.,'&()-]+$/.test(text.trim())) return false;

  // Degree abbreviations and institution keywords
  const allowedAbbreviations = [
    "BCA",
    "BBA",
    "BSc",
    "B.Tech",
    "BE",
    "BA",
    "MCA",
    "MBA",
    "M.Tech",
    "ME",
    "MSc",
    "PhD",
    "LLB",
    "LLM",
    "Diploma",
    "PGDM",
  ];

  const institutionKeywords = [
    "University",
    "College",
    "Institute",
    "Academy",
    "School",
    "Polytechnic",
    "Campus",
    "Faculty",
    "Department",
    "Institution",
  ];

  // Split words
  const words = text.split(/\s+/).filter((w) => w.trim().length > 0);

  // Auto-approve if it matches "Degree + Institution" pattern
  const joined = text.toLowerCase();
  if (
    allowedAbbreviations.some((deg) => text.includes(deg)) &&
    institutionKeywords.some((word) => joined.includes(word.toLowerCase()))
  ) {
    return true;
  }

  // Allow proper nouns (capitalized words like "Surana", "Harvard")
  const capitalized = words.filter((w) => /^[A-Z][a-z]+$/.test(w));
  if (capitalized.length >= 1) return true;

  // Dictionary check for lowercase words (skip capitalized or abbreviations)
  const toCheck = words
    .filter((w) => !allowedAbbreviations.includes(w) && /^[a-z]+$/.test(w))
    .slice(0, 3); // sample up to 3 words

  if (toCheck.length === 0) return true;

  try {
    const results = await Promise.all(
      toCheck.map(async (word) => {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        return res.ok;
      })
    );
    return results.every(Boolean);
  } catch {
    // If dictionary API fails, assume valid to not block user
    return true;
  }
}

interface Props {
  formData: AppFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppFormData>>;
  onComplete: (answers: Record<string, string>) => void;
}

const QUESTION_GROUPS = [
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
      { key: "proudProject", label: "Project you're most proud of" },
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
        label: "How you'll engage campus community",
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

const EXAMPLE_ANSWERS: Record<string, string> = {
  ugMajor: "e.g., Computer Science from MIT, graduated 2023 with honors",
  impactCourses:
    "e.g., Advanced AI course where I built a neural network for image classification",
  honors: "e.g., Dean's List 2021–2023, Presidential Scholarship recipient",
};

export default function Questionnaire({
  formData,
  setFormData,
  onComplete,
}: Props) {
  const [subStep, setSubStep] = useState(0);
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [subStep]);

  const group = QUESTION_GROUPS[subStep];
  const total = QUESTION_GROUPS.length;

  const isComplete = group.items.every(({ key }) => {
    const val = formData[key];
    return (
      typeof val === "string" && val.trim().length > 0 && !invalidFields[key]
    );
  });

  const handleChange = async (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (value.trim().length > 3) {
      const valid = await isMeaningfulSentence(value);
      setInvalidFields((prev) => ({ ...prev, [key]: !valid }));
    } else {
      setInvalidFields((prev) => ({ ...prev, [key]: true }));
    }
  };

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

  const colors = [
    "from-blue-500 to-indigo-600",
    "from-green-500 to-emerald-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-teal-500 to-cyan-600",
  ];

  const getSectionColor = (i: number) =>
    colors[i] || "from-gray-500 to-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Step Header */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          {QUESTION_GROUPS.map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  i === subStep
                    ? `bg-gradient-to-r ${getSectionColor(i)} text-white`
                    : i < subStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < subStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < QUESTION_GROUPS.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    i < subStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      {group.items.map(({ key, label }, index) => {
        const value = formData[key] || "";
        const isInvalid = invalidFields[key];
        const isAnswered = value.trim().length > 0 && !isInvalid;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <Label
              htmlFor={key}
              className="text-base font-semibold text-gray-800 block mb-2"
            >
              {label}
            </Label>
            <Textarea
              id={key}
              value={value}
              placeholder={
                EXAMPLE_ANSWERS[key] || "Type your detailed response..."
              }
              onChange={(e) => handleChange(key, e.target.value)}
              className={`min-h-32 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${
                isInvalid
                  ? "border-red-400 focus:border-red-500"
                  : isAnswered
                  ? "border-green-400 focus:border-green-600"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              rows={4}
            />
            {isInvalid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-red-500 text-sm mt-2"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Please enter meaningful text with correct spelling.
              </motion.div>
            )}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-green-600 text-sm mt-2"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Looks good!
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          variant="outline"
          disabled={subStep === 0}
          onClick={() => setSubStep(subStep - 1)}
          className="rounded-xl px-6 py-3 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {subStep < total - 1 ? (
          <Button
            disabled={!isComplete}
            onClick={() => setSubStep(subStep + 1)}
            className={`rounded-xl px-6 py-3 font-medium ${
              isComplete
                ? `bg-gradient-to-r ${getSectionColor(subStep)} text-white`
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            disabled={!isComplete}
            onClick={() => onComplete(buildAnswersMap())}
            className={`rounded-xl px-6 py-3 font-medium ${
              isComplete
                ? `bg-gradient-to-r ${getSectionColor(subStep)} text-white`
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete & Continue
          </Button>
        )}
      </div>
    </motion.div>
  );
}
