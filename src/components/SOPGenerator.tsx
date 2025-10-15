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
import CreatableCombobox from "./CreatableCombobox";
import { paymentService } from "@/services/paymentService";
import { loadRazorpayScript } from "@/utils/razorpay";
import { leadService } from "@/services/leadService";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
  handler: (response: any) => void;
}

interface PaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
    country: "Germany",
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
  // Add these state variables after your existing useState declarations
  const [selectedPackage, setSelectedPackage] = useState<"expert" | "quick">(
    "expert"
  );
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Package configurations
  const packages = {
    expert: {
      name: "SOP Expert",
      price: 1500,
      displayPrice: "₹1,500",
      features: [
        "We provide a tailored SOP customized to your profile and goals",
        "Our SOP expert crafts the draft based on the inputs you provide",
        "Receive a professionally written SOP that reflects your unique story",
      ],
    },
    // quick: {
    //   name: "SOP Quick",
    //   price: 199,
    //   displayPrice: "₹199",
    //   features: [
    //     "Access to a bundle of winning SOPs",
    //     "Create personalised SOP draft",
    //     "Bring your SOP for expert review feedback",
    //   ],
    // },
  };

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
    Germany: {
      universities: [
        "Carl Benz School",
        "Charité - Universitätsmedizin Berlin",
        "Constructor University",
        "ESMT Berlin",
        "FAU WiSo Nuremberg",
        "Freie Universität Berlin",
        "Furtwangen University",
        "Goethe University Frankfurt",
        "Heidelberg University",
        "Hochschule Bielefeld",
        "Humboldt-Universität zu Berlin",
        "Justus Liebig University Giessen",
        "Karlsruhe Institute of Technology (KIT)",
        "LMU Munich",
        "Leibniz Universität Hannover",
        "Leuphana University Lüneburg",
        "Munich University of Applied Sciences",
        "OTH Regensburg",
        "RWTH Business School",
        "Ruhr-Universität Bochum",
        "TU Dortmund University",
        "Technical University of Munich (TUM)",
        "Technische Universität Berlin",
        "Technische Universität Dresden",
        "University of Cologne",
        "University of Freiburg",
        "University of Göttingen",
        "University of Hohenheim",
        "University of Kassel",
        "University of Konstanz",
        "University of Mannheim",
        "University of Münster",
        "University of Passau",
        "University of Potsdam",
        "University of Stuttgart",
        "University of Tübingen",
        "Universität Hamburg",
        "Universität Regensburg",
        "Bard College Berlin",
        "Berlin School of Business and Innovation",
        "Bucerius Law School (not initially listed—add here as known reputable private law school)",
        "CBS International Business School (Cologne)",
        "CODE University of Applied Sciences",
        "Charité – Universitätsmedizin Berlin",
        "Cologne Business School",
        "EBS Universität für Wirtschaft und Recht",
        "FOM Hochschule für Oekonomie und Management",
        "Fachhochschule Wedel",
        "Frankfurt School of Finance & Management",
        "Fresenius University of Applied Sciences",
        "GISMA Business School",
        "HHL Leipzig Graduate School of Management",
        "Hamburger Fern-Hochschule (from broader lists)",
        "Hertie School of Governance",
        "Hochschule Fresenius (Idstein & various campuses)",
        "IST-Hochschule für Management (Düsseldorf)",
        "IU International University of Applied Sciences",
        "IU Internationale Hochschule (Erfurt)",
        "International School of Management (ISM) (from standyou list)",
        "Jacobs University Bremen (now Constructor University)",
        "Katholische Universität Eichstätt-Ingolstadt",
        "Kühne Logistics University (KLU)",
        "Munich Business School",
        "Quadriga University of Applied Sciences Berlin (from broader lists)",
        "SRH Hochschulen (Heidelberg)",
        "Steinbeis-Hochschule Berlin",
        "University of Applied Sciences Europe (Iserlohn)",
        "University of Europe for Applied Sciences",
        "Universität Witten/Herdecke",
        "WHU – Otto Beisheim School of Management",
        "Wilhelm Büchner University of Applied Sciences",
        "Zeppelin University",
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
  } as const;

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
    setIsPaymentLoading(true);

    const selectedPkg = packages[selectedPackage];
    const amount = selectedPkg.price; // Remove split payment calculation

    // Validate required form data
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please ensure your name, email, and phone are provided.",
        variant: "destructive",
      });
      setIsPaymentLoading(false);
      return;
    }

    try {
      // Load Razorpay SDK
      const res = await loadRazorpayScript();
      if (!res) {
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load Razorpay SDK. Please try again.",
          variant: "destructive",
        });
        setIsPaymentLoading(false);
        return;
      }

      // Create Razorpay order via backend
      const order = await paymentService.createOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: amount,
        description: `${selectedPkg.name} - SOP Generation Service`,
      });

      if (!order?.success) {
        toast({
          title: "Order Creation Failed",
          description: "Unable to initiate payment. Please try again.",
          variant: "destructive",
        });
        setIsPaymentLoading(false);
        return;
      }

      // Razorpay checkout options
      const options: RazorpayOptions = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Global Minds India",
        description: order.description,
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#3B82F6" },

        handler: async function (response: PaymentResponse) {
          try {
            // Verify payment on backend
            const verify = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internal_receipt_id: order.internal_receipt_id,
            });

            if (verify.success) {
              // Create lead/order record after successful verification
              const date = new Date();
              const formatted = date.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              const payload = {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phone,
                serviceType: selectedPkg.name,
                leadSource: "SOP_GENERATION_SERVICE",
                userNotes: `Package: ${selectedPkg.name}; University: ${formData.university}; Course: ${formData.course}`,
                purpose: "SOP_GENERATION",
                serviceName: selectedPkg.name,
                purchaseDate: formatted,
                paymentAmount: amount,
                domainUrl: window.location.origin,
              };

              // Create lead entry
              const { lead } = await leadService.createLeads(payload);
              if (lead) {
                // Call your existing SOP verification API
                const output_pdf = `sop_${sopId}_${Date.now()}.pdf`;
                const sopResponse = await sopService.verifyPayment(
                  sopId!,
                  output_pdf
                );

                setPaymentCompleted(true);

                // Show success message
                toast({
                  title: "Payment Successful! ✅",
                  description:
                    "Payment confirmed. Your SOP will be ready within 24-48 hours.",
                });

                // Auto-navigate to result after successful payment
                setTimeout(() => {
                  setCurrentStep("result");
                }, 2000);
              }
            } else {
              toast({
                title: "Payment Verification Failed",
                description:
                  "Please contact support with your payment details.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            toast({
              title: "Payment Error",
              description:
                error.message || "Something went wrong during verification.",
              variant: "destructive",
            });
          }
        },
      };

      // Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPaymentLoading(false);
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
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            country: value,
                            university: "",
                            course: "",
                          })
                        }
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

                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor="university"
                        className="text-sm font-medium"
                      >
                        University
                      </Label>
                      <CreatableCombobox
                        disabled={!formData.country}
                        value={formData.university}
                        onChange={(val) =>
                          setFormData({ ...formData, university: val })
                        }
                        options={
                          formData.country
                            ? universityData[
                                formData.country as keyof typeof universityData
                              ].universities
                            : []
                        }
                        placeholder="Search or enter university"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">
                        Course/Program
                      </Label>
                      <CreatableCombobox
                        disabled={!formData.country}
                        value={formData.course}
                        onChange={(val) =>
                          setFormData({ ...formData, course: val })
                        }
                        options={
                          formData.country
                            ? universityData[
                                formData.country as keyof typeof universityData
                              ].courses
                            : []
                        }
                        placeholder="Search or enter course"
                      />
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
                <div className="space-y-6 animate-scale-in max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      Choose Your SOP Package
                    </h2>
                    <p className="text-muted-foreground">
                      Select the package that best fits your needs
                    </p>
                  </div>

                  {/* Package Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* SOP Expert Package - Most Popular */}
                    <div
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedPackage === "expert"
                          ? "transform scale-105"
                          : ""
                      }`}
                      onClick={() => setSelectedPackage("expert")}
                    >
                      {/* Most Popular Badge */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </div>
                      </div>

                      <div
                        className={`bg-white rounded-2xl p-6 border-2 shadow-lg relative transition-all duration-200 ${
                          selectedPackage === "expert"
                            ? "border-blue-600 shadow-blue-100"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {/* Radio Button */}
                        <div className="absolute top-6 left-6">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedPackage === "expert"
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {selectedPackage === "expert" && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>

                        <div className="pt-8">
                          {/* Package Header */}
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">
                              {packages.expert.name}
                            </h3>
                            <div className="text-right">
                              <span className="text-2xl font-bold">
                                {packages.expert.displayPrice}
                              </span>
                            </div>
                          </div>

                          {/* Includes Section */}
                          <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-4">
                              Includes
                            </h4>
                            <div className="space-y-3">
                              {packages.expert.features.map(
                                (feature, index) => (
                                  <div key={index} className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                      {feature}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-900">
                        Total amount:
                      </span>
                      <span className="text-xl font-bold text-blue-900">
                        {packages[selectedPackage].displayPrice}
                      </span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-muted-foreground">
                      Secured by 256-bit SSL encryption
                    </span>
                  </div>

                  {/* Payment Button */}
                  {!paymentCompleted ? (
                    <Button
                      onClick={handlePayment}
                      disabled={isPaymentLoading}
                      className="w-full rounded-xl py-4 text-lg shadow-hover hover:shadow-hover bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      size="lg"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      {isPaymentLoading
                        ? "Processing..."
                        : `Pay ${packages[selectedPackage].displayPrice} - Generate SOP`}
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <p className="text-green-700 font-medium">
                        Payment Successful!
                      </p>
                      <p className="text-sm text-green-600">
                        Payment confirmed. Starting SOP generation...
                      </p>
                    </div>
                  )}
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
