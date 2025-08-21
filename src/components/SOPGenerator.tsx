import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  Copy,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Step = "university" | "resume" | "questions" | "generate" | "result";

interface FormData {
  university: string;
  course: string;
  resume: File | null;
  experience: string;
  motivation: string;
  goals: string;
}

export default function SOPGenerator() {
  const [currentStep, setCurrentStep] = useState<Step>("university");
  const [formData, setFormData] = useState<FormData>({
    university: "",
    course: "",
    resume: null,
    experience: "",
    motivation: "",
    goals: "",
  });
  const [generatedSOP, setGeneratedSOP] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const universities = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "UC Berkeley",
    "Oxford University",
    "Cambridge University",
    "Yale University",
    "Princeton University",
  ];

  const courses = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Medicine",
    "Law",
    "Economics",
    "Psychology",
    "International Relations",
  ];

  const handleNext = () => {
    const steps: Step[] = [
      "university",
      "resume",
      "questions",
      "generate",
      "result",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Step[] = [
      "university",
      "resume",
      "questions",
      "generate",
      "result",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
      toast({
        title: "Resume uploaded! 📄",
        description: "Your resume has been successfully uploaded.",
      });
    }
  };

  const generateSOP = async () => {
    setIsGenerating(true);
    // Simulate SOP generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockSOP = `Dear Admissions Committee,

I am writing to express my strong interest in pursuing a ${formData.course} program at ${formData.university}. My academic journey and professional experiences have led me to this pivotal moment where I am ready to advance my knowledge and contribute meaningfully to your esteemed institution.

${formData.motivation}

Throughout my academic and professional journey, I have gained valuable experience in ${formData.experience}. This foundation has not only strengthened my technical skills but also developed my analytical thinking and problem-solving abilities.

Looking forward, my career goals are clear: ${formData.goals}. I believe that the ${formData.course} program at ${formData.university} will provide me with the advanced knowledge, research opportunities, and global perspective necessary to achieve these aspirations.

I am excited about the opportunity to contribute to your academic community and look forward to the challenges and growth that lie ahead.

Sincerely,
[Your Name]`;

    setGeneratedSOP(mockSOP);
    setIsGenerating(false);
    setCurrentStep("result");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSOP);
    toast({
      title: "Copied! 📋",
      description: "SOP has been copied to your clipboard.",
    });
  };

  const downloadSOP = () => {
    const blob = new Blob([generatedSOP], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statement-of-purpose.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded! ⬇️",
      description: "Your SOP has been downloaded successfully.",
    });
  };

  const stepTitles = {
    university: "Choose Your Destination 🎓",
    resume: "Upload Your Resume 📄",
    questions: "Tell Us About Yourself ✨",
    generate: "Ready to Generate? 🚀",
    result: "Your Statement of Purpose 📝",
  };

  const isStepComplete = (step: Step) => {
    switch (step) {
      case "university":
        return formData.university && formData.course;
      case "resume":
        return formData.resume !== null;
      case "questions":
        return formData.experience && formData.motivation && formData.goals;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-12 px-4">
      {/* Back to Landing Page */}
      <div className="absolute top-6 left-6">
        <Button
          className="rounded-xl flex items-center"
          onClick={() => {
            if (currentStep !== "university") {
              Swal.fire({
                title: "Leave this page?",
                text: "Your progress will be lost if you go back to the landing page.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, go back",
                cancelButtonText: "Stay here",
                confirmButtonColor: "#ef4444", // red
                cancelButtonColor: "#3b82f6", // blue
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = "/"; // redirect to landing
                }
              });
            } else {
              window.location.href = "/"; // direct redirect
            }
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {["university", "resume", "questions", "generate", "result"].map(
              (step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      currentStep === step
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : isStepComplete(step as Step) ||
                          (step === "generate" && currentStep === "result")
                        ? "bg-pastel-green text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                        isStepComplete(
                          ["university", "resume", "questions", "generate"][
                            index
                          ] as Step
                        ) ||
                        index <
                          [
                            "university",
                            "resume",
                            "questions",
                            "generate",
                          ].indexOf(currentStep)
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-card bg-gradient-card border-0 animate-fade-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              {stepTitles[currentStep]}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {currentStep === "university" && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-sm font-medium">
                      University
                    </Label>
                    <Select
                      value={formData.university}
                      onValueChange={(value) =>
                        setFormData({ ...formData, university: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border bg-input">
                        <SelectValue placeholder="Select your dream university" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((uni) => (
                          <SelectItem key={uni} value={uni}>
                            {uni}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-sm font-medium">
                      Course/Program
                    </Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) =>
                        setFormData({ ...formData, course: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border bg-input">
                        <SelectValue placeholder="Select your program" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "resume" && (
              <div className="space-y-6 animate-slide-up">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-pastel-blue">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload your resume</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, or DOCX up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("resume-upload")?.click()
                    }
                    className="mt-4 rounded-xl"
                    variant="outline"
                  >
                    Choose File
                  </Button>
                  {formData.resume && (
                    <p className="mt-4 text-sm text-primary font-medium">
                      ✅ {formData.resume.name} uploaded successfully!
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === "questions" && (
              <div className="space-y-6 animate-slide-up">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    Academic & Professional Experience 🎯
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your academic achievements, internships, projects, or work experience..."
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="min-h-24 rounded-xl border-border bg-input resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivation" className="text-sm font-medium">
                    Why This Program? 💭
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="What motivates you to pursue this specific program at this university?"
                    value={formData.motivation}
                    onChange={(e) =>
                      setFormData({ ...formData, motivation: e.target.value })
                    }
                    className="min-h-24 rounded-xl border-border bg-input resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-sm font-medium">
                    Future Goals 🌟
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="What are your career aspirations and how will this program help you achieve them?"
                    value={formData.goals}
                    onChange={(e) =>
                      setFormData({ ...formData, goals: e.target.value })
                    }
                    className="min-h-24 rounded-xl border-border bg-input resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === "generate" && (
              <div className="text-center space-y-6 animate-scale-in">
                <div className="bg-pastel-purple rounded-2xl p-8">
                  <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to Generate Your SOP!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We'll craft a personalized statement of purpose based on
                    your information.
                  </p>
                  <Button
                    onClick={generateSOP}
                    disabled={isGenerating}
                    className="rounded-xl px-8 py-3 text-lg shadow-hover hover:shadow-hover"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate My SOP
                        <Sparkles className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "result" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-card rounded-2xl p-6 border shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Your Statement of Purpose
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="rounded-lg"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadSOP}
                        className="rounded-lg"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background rounded-xl p-6 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {generatedSOP}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== "result" && (
              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === "university"}
                  className="rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    !isStepComplete(currentStep) && currentStep !== "generate"
                  }
                  className="rounded-xl"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === "result" && (
              <div className="flex justify-center pt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep("university");
                    setFormData({
                      university: "",
                      course: "",
                      resume: null,
                      experience: "",
                      motivation: "",
                      goals: "",
                    });
                    setGeneratedSOP("");
                  }}
                  className="rounded-xl"
                >
                  Create Another SOP
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
