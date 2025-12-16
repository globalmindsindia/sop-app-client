import { useState, useEffect, useRef } from "react";
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

// --- Text Normalization ---
function normalizeText(input: string) {
  return input
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/—|–/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Better Meaningful Sentence Validator ---
function isMeaningfulSentence(text: string): boolean {
  return true;
  // if (!text) return false;

  // const s = normalizeText(text);

  // // Too short? reject
  // if (s.length < 10) return false;

  // // Allow common technical and punctuation characters
  // if (!/^[A-Za-z0-9\s.,:;!?'"()/+\-&]+$/.test(s)) return false;

  // const words = s.split(/\s+/).filter(Boolean);
  // if (words.length < 3) return false;

  // // must contain letters
  // const letterCount = (s.match(/[A-Za-z]/g) || []).length;
  // if (letterCount < 5) return false;

  // // Reject gibberish (too many numbers or random chars)
  // const nonLetterRatio = 1 - letterCount / s.length;
  // if (nonLetterRatio > 0.4) return false;

  // // Programming and academic keywords
  // const technicalTerms = [
  //   "C",
  //   "C++",
  //   "C#",
  //   "Python",
  //   "Java",
  //   "JavaScript",
  //   "Node",
  //   "IoT",
  //   "AI",
  //   "ML",
  //   "VLSI",
  //   "Embedded",
  //   "React",
  //   "System",
  //   "Project",
  //   "Research",
  //   "University",
  //   "Institute",
  //   "College",
  // ];
  // const hasTechTerm = technicalTerms.some((t) =>
  //   s.toLowerCase().includes(t.toLowerCase())
  // );

  // if (hasTechTerm) return true;

  // // At least one word >= 4 letters
  // if (words.some((w) => w.length >= 4)) return true;

  // return false;
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

  const validationTimers = useRef<Record<string, number | null>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Debounce validation
    if (validationTimers.current[key]) {
      clearTimeout(validationTimers.current[key]!);
    }

    validationTimers.current[key] = window.setTimeout(() => {
      const normalized = normalizeText(value);
      const valid = normalized.length > 3 && isMeaningfulSentence(normalized);
      setInvalidFields((prev) => ({ ...prev, [key]: !valid }));
      validationTimers.current[key] = null;
    }, 400);
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
      {/* STEP HEADER */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 bg-card rounded-2xl p-4 shadow-sm border border-muted">
          {QUESTION_GROUPS.map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${
                  i === subStep
                    ? "bg-primary text-primary-foreground"
                    : i < subStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
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
                  className={`w-8 h-0.5 transition-colors ${
                    i < subStep ? "bg-primary/40" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* QUESTIONS */}
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
            className="bg-card rounded-2xl p-6 border border-muted shadow-sm hover:shadow-md transition-all"
          >
            <Label
              htmlFor={key}
              className="text-base font-semibold text-foreground block mb-2"
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
              className={`min-h-32 rounded-xl border-2 resize-none transition-all duration-200 bg-muted focus:bg-card ${
                isInvalid
                  ? "border-destructive focus:border-destructive"
                  : isAnswered
                  ? "border-primary focus:border-primary"
                  : "border-muted focus:border-primary"
              }`}
              rows={4}
            />

            {isInvalid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-destructive text-sm mt-2"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Please enter meaningful text with correct spelling.
              </motion.div>
            )}

            {isAnswered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-primary text-sm mt-2"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Looks good!
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* NAVIGATION */}
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
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
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
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
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
