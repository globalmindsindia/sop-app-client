import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  Download,
  Copy,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
  CreditCard,
  Shield,
  Check,
  Home,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Questionnaire from "./Questionnaire";
import { AppFormData } from "@/types/types";
import { sopService } from "@/services/sopService";
import { handleError } from "@/helpers/errorHandler";
import Loader from "./Loader";

type Step =
  | "university"
  | "resume"
  | "questions"
  | "quality_check"
  | "payment"
  | "result";

export default function SOPGenerator() {
  // ✅ Fixed: Include quality_check in the steps array
  const steps: Step[] = [
    "university",
    "resume",
    "questions",
    "quality_check", // Added this step
    "payment",
    "result",
  ];

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("university");
  const [formData, setFormData] = useState<AppFormData>({
    country: "",
    university: "",
    course: "",
    name: "",
    email: "",
    phone: "",
    resume: null,
    preffered_length: "",
    specific_requirements: "",
  });
  const [generatedSOP, setGeneratedSOP] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { toast } = useToast();

  const [sopId, setSopId] = useState<number | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [qualityQuestions, setQualityQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [improvementAnswers, setImprovementAnswers] = useState<
    Record<string, string>
  >({});

  // ✅ Added: Track if quality check and improvements are completed
  const [qualityCheckCompleted, setQualityCheckCompleted] = useState(false);

  async function handleQuestionnaireComplete(
    answersFromQuestionnaire: Record<string, string>
  ) {
    try {
      // Merge Additional Questions into answers map, matching requested keys
      setLoading(true);
      const fullAnswers = {
        ...answersFromQuestionnaire,
        "Preffered length": formData.preffered_length || "450", // exact key as requested
        "specific requirements":
          formData.specific_requirements || "Do whatever you want", // exact key as requested
      };

      const payload = {
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        country: formData.country || "",
        university: formData.university || "",
        course: formData.course || "",
        answers: fullAnswers,
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload)); // JSON as string field
      if (formData.resume) fd.append("resume", formData.resume); // file field

      // Step 1: Submit SOP
      const { id } = await sopService.submitSop(fd); // POST /api/v1/sop/submit
      setSopId(id);

      // Step 2: Run quality check
      setPolling(true);
      pollQualityCheck(id);
    } catch (e) {
      handleError(e, toast);
    } finally {
      setLoading(false);
    }
  }

  async function pollQualityCheck(sopId: number, attempt = 0) {
    const maxAttempts = 10;
    const delay = 3000; // 3 seconds

    try {
      const res = await sopService.sopQualityCheck(sopId);

      // ✅ Stop polling if quality check is complete
      if (res.success && res.data?.phase === "quality_check") {
        setPolling(false);
        setQualityScore(res.data.quality_result.current_score);
        setQualityQuestions(res.data.quality_result.questions_to_improve || []);

        const initAns: Record<string, string> = {};
        (res.data.quality_result.questions_to_improve || []).forEach(
          (q) => (initAns[q] = "")
        );
        setImprovementAnswers(initAns);

        setCurrentStep("quality_check");
        // console.log("Quality check complete:", res.data.quality_result);
        return;
      }

      // Retry if not complete yet
      if (attempt < maxAttempts) {
        setTimeout(() => pollQualityCheck(sopId, attempt + 1), delay);
      } else {
        setPolling(false);
        console.error("Max attempts reached, stopping polling.");
      }
    } catch (err) {
      setPolling(false);
      handleError(err, toast);
    }
  }

  const handleBackToHome = () => {
    // Reset all form data
    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      university: "",
      course: "",
      resume: null,
      experience: "",
      preffered_length: "",
      specific_requirements: "",
    });
    setCurrentStep("university");
    setGeneratedSOP("");
    setPaymentCompleted(false);
    setQualityCheckCompleted(false); // ✅ Reset quality check status

    // Navigate to home
    window.location.href = "/";
  };

  const universityData = {
    USA: {
      universities: [
        "Harvard University",
        "Stanford University",
        "MIT",
        "UC Berkeley",
        "Yale University",
        "Princeton University",
      ],
      courses: [
        "Computer Science",
        "Business Administration",
        "Engineering",
        "Medicine",
        "Law",
        "Economics",
        "Psychology",
        "International Relations",
      ],
    },
    UK: {
      universities: [
        "Oxford University",
        "Cambridge University",
        "Imperial College London",
        "London School of Economics",
        "University College London",
      ],
      courses: [
        "Law",
        "Medicine",
        "Economics",
        "Political Science",
        "Data Science",
        "Engineering",
        "Psychology",
      ],
    },
    Canada: {
      universities: [
        "University of Toronto",
        "McGill University",
        "University of British Columbia",
        "University of Waterloo",
        "McMaster University",
      ],
      courses: [
        "Computer Science",
        "Engineering",
        "Medicine",
        "Environmental Science",
        "Business Administration",
        "Data Analytics",
      ],
    },
    Australia: {
      universities: [
        "University of Melbourne",
        "Australian National University",
        "University of Sydney",
        "University of Queensland",
        "Monash University",
      ],
      courses: [
        "Marine Biology",
        "Engineering",
        "Business Management",
        "Medicine",
        "Law",
        "Computer Science",
        "Architecture",
      ],
    },
    Germany: {
      universities: [
        "Technical University of Munich",
        "Heidelberg University",
        "Humboldt University of Berlin",
        "University of Freiburg",
        "RWTH Aachen University",
      ],
      courses: [
        "Mechanical Engineering",
        "Automotive Engineering",
        "Computer Science",
        "Physics",
        "Economics",
        "Medicine",
        "Philosophy",
      ],
    },
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
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

  const handleSubmitImprovements = async () => {
    if (!sopId) return;

    setLoading(true); // Show loader

    try {
      const res = await sopService.improvementSuggestions(sopId, {
        improvement_answers: improvementAnswers,
      });

      // Simulate polling or additional processing if needed
      if (res?.message === "Final SOP generated successfully") {
        setGeneratedSOP(res.sop_path);
        setQualityCheckCompleted(true); // ✅ Mark quality check as completed
        setCurrentStep("payment");
      } else {
        console.error("Failed to generate final SOP:", res);
      }
    } catch (err) {
      console.error("Error submitting improvements:", err);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handlePayment = async () => {
    try {
      // Show initial payment processing message
      toast({
        title: "Processing Payment...",
        description: "Please wait while we process your payment.",
      });

      // For demo purposes, simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if we have the required data
      if (!sopId) {
        toast({
          title: "Error",
          description: "SOP ID is missing. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Generate output_pdf filename (you might want to customize this logic)
      const output_pdf = `sop_${sopId}_${Date.now()}.pdf`;

      // Call the verifyPayment API
      const response = await sopService.verifyPayment(sopId, output_pdf);

      // Payment successful
      setPaymentCompleted(true);

      // ✅ Auto-navigate to result after successful payment
      setTimeout(() => {
        setCurrentStep("result");
      }, 1000);

      toast({
        title: "Payment Successful! ✅",
        description: response.message || "You can now generate your SOP.",
      });
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stepTitles = {
    university: "Choose Your Destination 🎓",
    resume: "Upload Your Resume 📄",
    questions: "Tell Us About Yourself ✨",
    quality_check: "Additional Questions ❓",
    payment: "Secure Payment 💳",
    result: "Thank You 📚",
  };

  // ✅ Fixed: Updated isStepComplete function to handle all steps properly
  const isStepComplete = (step: Step) => {
    switch (step) {
      case "university":
        return (
          formData.name &&
          formData.email &&
          formData.phone &&
          formData.country &&
          formData.university &&
          formData.course
        );
      case "resume":
        return formData.resume !== null;
      case "questions":
        // This should be handled by the questionnaire component completion
        return sopId !== null; // If sopId exists, questionnaire is complete
      case "quality_check":
        return qualityCheckCompleted; // Use the new state variable
      case "payment":
        return paymentCompleted;
      case "result":
        return true; // Result is always complete when reached
      default:
        return false;
    }
  };

  const countries = Object.keys(universityData);

  // ✅ Fixed: Updated progress step display to match actual steps
  const progressSteps = [
    { key: "university", label: "University", index: 1 },
    { key: "resume", label: "Resume", index: 2 },
    { key: "questions", label: "Questions", index: 3 },
    { key: "quality_check", label: "Quality", index: 4 },
    { key: "payment", label: "Payment", index: 5 },
    { key: "result", label: "Result", index: 6 },
  ];

  return (
    <>
      {/* Loader Overlay */}
      {(loading || polling) && (
        <>
          {loading && <Loader text="Processing..." />}
          {polling && (
            <Loader text="Performing quality check, please wait..." />
          )}
        </>
      )}

      <div className="min-h-screen bg-gradient-soft py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back to Home Button */}
          <div className="mb-4 md:mb-6">
            {currentStep === "university" ? (
              // Direct back if on first step
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="rounded-xl p-2 md:p-3 hover:bg-muted/50"
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            ) : (
              // Show alert if on step 2+
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-xl p-2 md:p-3 hover:bg-muted/50"
                    size="sm"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back to Home</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Application in Progress</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved progress in your SOP application. Are you
                      sure you want to go back to the home page? Your current
                      progress will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="rounded-lg">
                      Continue Application
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBackToHome}
                      className="rounded-lg bg-destructive hover:bg-destructive/90"
                    >
                      Yes, Go Back
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* ✅ Fixed: Updated Progress Steps to match actual flow */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
              {progressSteps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
                      currentStep === step.key
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : isStepComplete(step.key as Step)
                        ? "bg-pastel-green text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.index}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`w-4 md:w-8 h-0.5 mx-1 md:mx-2 transition-all duration-300 ${
                        isStepComplete(step.key as Step) ||
                        progressSteps.findIndex((s) => s.key === currentStep) >
                          index
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <Card className="shadow-card bg-gradient-card border-0 animate-fade-in">
            <CardHeader className="text-center pb-4 md:pb-6">
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                {stepTitles[currentStep]}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              {/* ... All your existing step content remains the same ... */}
              {currentStep === "university" && (
                <div className="space-y-6 animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Full Name */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="rounded-xl border-border bg-input"
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="rounded-xl border-border bg-input"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number (e.g., +91 9876543210)"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-xl border-border bg-input"
                        required
                      />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            country: value,
                            university: "",
                            course: "",
                          });
                        }}
                      >
                        <SelectTrigger className="rounded-xl border-border bg-input">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* University */}
                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor="university"
                        className="text-sm font-medium"
                      >
                        University
                      </Label>
                      <Select
                        value={formData.university}
                        onValueChange={(value) =>
                          setFormData({ ...formData, university: value })
                        }
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="rounded-xl border-border bg-input">
                          <SelectValue placeholder="Select university" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.country &&
                            universityData[formData.country].universities.map(
                              (uni) => (
                                <SelectItem key={uni} value={uni}>
                                  {uni}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Course */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">
                        Course/Program
                      </Label>
                      <Select
                        value={formData.course}
                        onValueChange={(value) =>
                          setFormData({ ...formData, course: value })
                        }
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="rounded-xl border-border bg-input">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.country &&
                            universityData[formData.country].courses.map(
                              (course) => (
                                <SelectItem key={course} value={course}>
                                  {course}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "resume" && (
                <div className="space-y-6 animate-slide-up">
                  <div className="border-2 border-dashed border-border rounded-xl p-4 md:p-8 text-center bg-pastel-blue">
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
                <Questionnaire
                  formData={formData}
                  setFormData={setFormData}
                  onComplete={(answers) => handleQuestionnaireComplete(answers)}
                />
              )}

              {currentStep === "quality_check" && (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                  {/* Quality Score Display */}
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      Quality Check
                    </h2>
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        {/* Circular Progress for Quality Score */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-gray-200"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-blue-600"
                            strokeWidth="10"
                            strokeDasharray={`${qualityScore * 2.51}, 251.2`} // 251.2 is 2πr for r=40
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800">
                          {qualityScore}/100
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Your Answer Quality Score
                    </p>
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-6">
                    {qualityQuestions.map((q, index) => (
                      <div key={q} className="space-y-2">
                        <Label className="text-lg font-medium text-gray-700">
                          {index + 1}. {q}
                        </Label>
                        <Textarea
                          value={improvementAnswers[q] || ""}
                          onChange={(e) =>
                            setImprovementAnswers((m) => ({
                              ...m,
                              [q]: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Provide your improvement suggestions here..."
                        />
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleSubmitImprovements}
                      disabled={
                        !Object.values(improvementAnswers).every((v) =>
                          v?.trim()
                        ) || loading
                      }
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit Improvements
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="space-y-6 animate-scale-in">
                  <div className="bg-gradient-card rounded-2xl p-4 md:p-8 border shadow-card">
                    <div className="text-center mb-6">
                      <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg md:text-xl font-semibold mb-2">
                        Secure Payment
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Complete your payment to generate your personalized SOP
                      </p>
                    </div>

                    <div className="bg-pastel-blue rounded-xl p-4 md:p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">
                          SOP Generation Service
                        </span>
                        <span className="text-xl font-bold text-primary">
                          $29.99
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Personalized SOP based on your profile
                        </div>
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Unlimited revisions for 7 days
                        </div>
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Multiple format downloads (PDF, Word, TXT)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Secured by 256-bit SSL encryption
                        </span>
                      </div>

                      {!paymentCompleted ? (
                        <Button
                          onClick={handlePayment}
                          className="w-full rounded-xl py-3 text-lg shadow-hover hover:shadow-hover"
                          size="lg"
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          Pay $29.99 - Generate SOP
                        </Button>
                      ) : (
                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                          <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                          <p className="text-green-700 font-medium">
                            Payment Successful!
                          </p>
                          <p className="text-sm text-green-600">
                            Redirecting to your results...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "result" && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto p-4">
                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border shadow-lg">
                    <CardHeader className="text-center">
                      <p className="text-xl md:text-2xl font-semibold text-foreground mt-2">
                        Your Statement of Purpose Being Tailored by our SOP
                        Experts!
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                      <p className="text-sm md:text-base text-muted-foreground">
                        Your Statement of Purpose has been successfully
                        generated and is being tailored to your specifications.
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground">
                        You will receive the final SOP via email within 24
                        hours.
                      </p>
                      <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-sm md:text-base text-muted-foreground">
                          For any queries, feel free to contact us:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                            asChild
                          >
                            <a href="mailto:support@example.com">
                              <Mail className="w-4 h-4" />
                              Email Us
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                            asChild
                          >
                            <a href="tel:+917353446655">
                              <Phone className="w-4 h-4" />
                              +91 7353446655
                            </a>
                          </Button>
                        </div>

                        <Button
                          variant="default"
                          className="mt-6"
                          onClick={() => (window.location.href = "/")}
                        >
                          Home
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ✅ Fixed: Updated Navigation Buttons Logic */}
              {currentStep !== "result" && (
                <div className="flex justify-between pt-6 md:pt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === "university"}
                    className="rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {/* ✅ Special handling for payment step */}
                  {currentStep === "payment" ? (
                    // Don't show Next button on payment step, let payment completion handle navigation
                    <div></div>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepComplete(currentStep)}
                      className="rounded-xl"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
