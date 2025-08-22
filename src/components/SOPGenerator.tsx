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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Step =
  | "university"
  | "resume"
  | "questions"
  | "payment"
  | "generate"
  | "result";

interface FormData {
  university: string;
  course: string;
  resume: File | null;
  experience: string;
  motivation: string;
  goals: string;
}

export default function SOPGenerator() {
  const navigate = useNavigate();
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
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { toast } = useToast();

  const hasProgress = () => {
    const steps: Step[] = [
      "university",
      "resume",
      "questions",
      "payment",
      "generate",
      "result",
    ];
    const currentIndex = steps.indexOf(currentStep);
    return (
      currentIndex > 0 ||
      formData.university ||
      formData.course ||
      formData.resume ||
      formData.experience ||
      formData.motivation ||
      formData.goals
    );
  };

  const handleBackToHome = () => {
    // Reset all form data
    setFormData({
      university: "",
      course: "",
      resume: null,
      experience: "",
      motivation: "",
      goals: "",
    });
    setCurrentStep("university");
    setGeneratedSOP("");
    setPaymentCompleted(false);

    // Navigate to home
    window.location.href = "/";
  };

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
      "payment",
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
      "payment",
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

  const handlePayment = () => {
    // This would integrate with Stripe when Supabase is connected
    toast({
      title: "Payment Required",
      description:
        "Please connect Supabase to enable Stripe payment processing.",
    });
    // For demo purposes, we'll simulate payment completion
    setTimeout(() => {
      setPaymentCompleted(true);
      toast({
        title: "Payment Successful! ✅",
        description: "You can now generate your SOP.",
      });
    }, 2000);
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
    payment: "Secure Payment 💳",
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
      case "payment":
        return paymentCompleted;
      default:
        return false;
    }
  };

  return (
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
        {/* Progress Steps */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {[
              "university",
              "resume",
              "questions",
              "payment",
              "generate",
              "result",
            ].map((step, index) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
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
                {index < 5 && (
                  <div
                    className={`w-4 md:w-8 h-0.5 mx-1 md:mx-2 transition-all duration-300 ${
                      isStepComplete(
                        [
                          "university",
                          "resume",
                          "questions",
                          "payment",
                          "generate",
                        ][index] as Step
                      ) ||
                      index <
                        [
                          "university",
                          "resume",
                          "questions",
                          "payment",
                          "generate",
                        ].indexOf(currentStep)
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
            {currentStep === "university" && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid gap-6 md:grid-cols-2">
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
                          You can now proceed to generate your SOP
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === "generate" && (
              <div className="text-center space-y-6 animate-scale-in">
                <div className="bg-pastel-purple rounded-2xl p-4 md:p-8">
                  <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    Ready to Generate Your SOP!
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    We'll craft a personalized statement of purpose based on
                    your information.
                  </p>
                  <Button
                    onClick={generateSOP}
                    disabled={isGenerating}
                    className="rounded-xl px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg shadow-hover hover:shadow-hover"
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
                <div className="bg-gradient-card rounded-2xl p-4 md:p-6 border shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <h3 className="text-base md:text-lg font-semibold flex items-center">
                      <FileText className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                      Your Statement of Purpose
                    </h3>
                    <div className="flex gap-2 justify-center md:justify-end">
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
                  <div className="bg-background rounded-xl p-4 md:p-6 max-h-64 md:max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed text-foreground">
                      {generatedSOP}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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
              <div className="flex justify-center pt-6 md:pt-8">
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
                    setPaymentCompleted(false);
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
