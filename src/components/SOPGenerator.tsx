import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

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
  MessageCircle,
  GraduationCap,
  X,
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
import { masterCourseService } from "@/services/mastersCourseService";
import SOPBackgroundImage from "@/assets/SOP_Background.jpg";
import GMILogo from "@/assets/gmi_logo.png";

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
  | "review"
  | "quality_check"
  | "payment"
  | "result";

export default function SOPGenerator() {
  // ✅ Fixed: Include quality_check in the steps array
  const steps: Step[] = [
    "university",
    "resume",
    "questions",
    "review",
    "quality_check", // Added this step
    "payment",
    "result",
  ];

  const [currentStep, setCurrentStep] = useState<Step>("university");
  const [formData, setFormData] = useState<AppFormData>({
    country: undefined,
    university: "",
    course: "",
    name: "",
    email: "",
    phone: "",
    resume: null,
    preffered_length: "",
    specific_requirements: "",
  });

  const isProceedingRef = useRef(false);
  const [generatedSOP, setGeneratedSOP] = useState("");
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [resumeValidated, setResumeValidated] = useState(false);
  const [resumeValidationError, setResumeValidationError] = useState("");
  const [isValidatingResume, setIsValidatingResume] = useState(false);
  // Pagination & loading states
  const [countries, setCountries] = useState<string[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [hasMoreCountries, setHasMoreCountries] = useState(true);
  const [countryPage, setCountryPage] = useState(1);
  const [uniPage, setUniPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [hasMoreCourses, setHasMoreCourses] = useState(true);
  const [hasMoreUniversities, setHasMoreUniversities] = useState(true);

  function debounce<T extends (...args: any[]) => void>(func: T, delay = 400) {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedUniSearch = debounce((query: string) => {
    if (formData.country && query.length > 1) {
      loadUniversities(formData.country, 1, 25, query);
    } else if (query.length === 0 && formData.country) {
      loadUniversities(formData.country, 1); // reset list
    }
  }, 400);

  const debouncedCourseSearch = debounce((query: string) => {
    if (formData.country && query.length > 1) {
      loadCourses(formData.country, 1, 25, query);
    } else if (query.length === 0 && formData.country) {
      loadCourses(formData.country, 1); // reset list
    }
  }, 400);

  // Validation functions
  const validateName = (name: string): string | null => {
    if (name.length < 3) return "Name must be at least 3 characters long";
    if (/\d/.test(name)) return "Name should not contain numbers";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    const cleanPhone = phone.replace(/^\+91\s*/, "");

    if (cleanPhone.length !== 10)
      return "Phone number must be exactly 10 digits";
    if (!/^[6-9]/.test(cleanPhone))
      return "Phone number must start with 6, 7, 8, or 9";
    if (!/^\d+$/.test(cleanPhone))
      return "Phone number should contain only digits";

    // Check for 5 or more consecutive same digits
    for (let i = 0; i <= cleanPhone.length - 5; i++) {
      const digit = cleanPhone[i];
      let count = 1;
      for (
        let j = i + 1;
        j < cleanPhone.length && cleanPhone[j] === digit;
        j++
      ) {
        count++;
      }
      if (count >= 5)
        return "Phone number cannot have 5 or more consecutive same digits";
    }

    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    let error: string | null = null;

    if (field === "phone") {
      let cleanValue = value.replace(/[^\d+]/g, "");

      if (cleanValue && !cleanValue.startsWith("+91")) {
        cleanValue = "+91 " + cleanValue;
      } else if (cleanValue.startsWith("+91")) {
        const digits = cleanValue.substring(3);
        cleanValue = "+91 " + digits;
      }

      processedValue = cleanValue;
      error = validatePhone(processedValue);
    } else if (field === "name") {
      processedValue = value.replace(/\d/g, "");
      error = validateName(processedValue);
      // Reset resume validation when name changes
      if (formData.resume) {
        setResumeValidated(false);
        setResumeValidationError("");
      }
    } else if (field === "email") {
      error = validateEmail(value);
    }

    setFormData({ ...formData, [field]: processedValue });
    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateResumeWithName = async () => {
    if (!formData.name || !formData.resume) return false;

    setIsValidatingResume(true);
    setResumeValidationError("");

    try {
      const result = await sopService.validateResume(
        formData.name,
        formData.resume
      );

      if (result.key) {
        setResumeValidated(true);
        return true;
      } else {
        setResumeValidationError(
          result.message ||
            "Resume name validation failed. Please ensure the name on your resume matches the name entered in the form."
        );
        setResumeValidated(false);
        return false;
      }
    } catch (error: any) {
      setResumeValidationError(
        "Validation Failure: Please ensure the name provided in your Personal Info matches the name on your resume.!!"
      );
      setResumeValidated(false);
      return false;
    } finally {
      setIsValidatingResume(false);
    }
  };

  useEffect(() => {
    setShowInstructions(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleCloseInstructions = () => {
    isProceedingRef.current = true; // ✅ mark as valid proceed
    setShowInstructions(false);
    // sessionStorage.setItem("instructionsShown", "true");
  };

  // Package configurations
  const originalPrice = 1299;
  const discountedPrice = couponApplied
    ? Math.round(originalPrice * 0.9)
    : originalPrice;

  const packages = {
    expert: {
      name: "SOP Expert",
      price: discountedPrice,
      displayPrice: `₹${discountedPrice.toLocaleString()}`,
      originalPrice: originalPrice,
      features: [
        "We provide a tailored SOP customized to your profile and goals",
        "Our SOP expert crafts the draft based on the inputs you provide",
        "Receive a professionally written SOP that reflects your unique story",
      ],
    },
  };

  const handleCouponApply = () => {
    setCouponError("");
    if (couponCode.toUpperCase() === "GMI10") {
      setCouponApplied(true);
      // toast({
      //   title: "Coupon Applied! 🎉",
      //   description: "10% discount has been applied to your order.",
      // });
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleCouponRemove = () => {
    setCouponApplied(false);
    setCouponCode("");
    setCouponError("");
  };

  async function handleQuestionnaireComplete(
    answersFromQuestionnaire: Record<string, string>
  ) {
    try {
      setLoading(true);
      const fullAnswers = {
        ...answersFromQuestionnaire,
        "Preffered length": formData.preffered_length || "450",
        "specific requirements":
          formData.specific_requirements || "Not Specified",
      };

      setFormData((prev) => ({ ...prev, answers: fullAnswers }));
      setAnswers(fullAnswers);

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
      fd.append("data", JSON.stringify(payload));
      if (formData.resume) fd.append("resume", formData.resume);

      // Step 1: Submit SOP - but DON'T trigger quality check yet
      const { id } = await sopService.submitSop(fd);
      setSopId(id);

      // ✅ REMOVED: setPolling(true) and pollQualityCheck(id)
      // Quality check will be triggered AFTER review is confirmed

      // Move to review step instead of quality check
      setCurrentStep("review");

      // toast({
      //   title: "Questionnaire Submitted! ✓",
      //   description: "Please review your application before proceeding.",
      // });
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
        return;
      }

      // Retry if not complete yet
      if (attempt < maxAttempts) {
        setTimeout(() => pollQualityCheck(sopId, attempt + 1), delay);
      } else {
        setPolling(false);
        console.error("Max attempts reached, stopping polling.");
        toast({
          title: "Quality Check Timeout",
          description: "Please refresh and try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setPolling(false);
      handleError(err, toast);
    }
  }

  async function handleReviewConfirm() {
    if (!sopId) {
      toast({
        title: "Error",
        description: "SOP ID not found. Please restart the process.",
        variant: "destructive",
      });
      return;
    }

    try {
      setReviewCompleted(true);

      // ✅ NOW trigger quality check after review is confirmed
      setPolling(true);
      pollQualityCheck(sopId);
    } catch (e) {
      handleError(e, toast);
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
      // experience: "",
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

  const loadCountries = async (page = 1, search = "") => {
    if (loadingCountries) return;
    setLoadingCountries(true);
    try {
      const res = await masterCourseService.getPaginated(page, 25, search);
      if (res.success) {
        const newCountries = res.data.map((d: any) => d.country);
        setCountries((prev) =>
          page === 1 ? newCountries : [...prev, ...newCountries]
        );
        setHasMoreCountries(page < res.pagination.totalPages);
        setCountryPage(page + 1);
      }
    } catch (err) {
      console.error("❌ Error loading countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  };

  // initial load
  useEffect(() => {
    loadCountries(1);
  }, []);

  useEffect(() => {
    if (formData.country) {
      loadUniversities(formData.country, 1);
      loadCourses(formData.country, 1);
    } else {
      setUniversities([]);
      setCourses([]);
    }
  }, [formData.country]);

  const loadUniversities = async (
    country: string,
    page = 1,
    limit = 25,
    search = ""
  ) => {
    if (!country || loadingUniversities) return;
    setLoadingUniversities(true);

    try {
      const res = await masterCourseService.getUniversities(
        country,
        page,
        limit,
        search
      );
      const { data, pagination } = res;

      setUniversities((prev) => (page === 1 ? data : [...prev, ...data]));
      setUniPage(page + 1);
      setHasMoreUniversities(pagination.currentPage < pagination.totalPages);
    } catch (err) {
      console.error("❌ Failed to load universities:", err);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const loadCourses = async (
    country: string,
    page = 1,
    limit = 25,
    search = ""
  ) => {
    if (!country || loadingCourses) return;
    setLoadingCourses(true);

    try {
      const res = await masterCourseService.getCourses(
        country,
        page,
        limit,
        search
      );
      const { data, pagination } = res;

      setCourses((prev) => (page === 1 ? data : [...prev, ...data]));
      setCoursePage(page + 1);
      setHasMoreCourses(pagination.currentPage < pagination.totalPages);
    } catch (err) {
      console.error("❌ Failed to load courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleNext = async () => {
    const currentIndex = steps.indexOf(currentStep);

    // Resume validation before proceeding to questions
    if (currentStep === "resume") {
      if (!formData.name || !formData.resume) {
        toast({
          title: "Missing Information",
          description: "Please ensure both name and resume are provided.",
          variant: "destructive",
        });
        return;
      }

      if (!resumeValidated) {
        const isValid = await validateResumeWithName();
        if (!isValid) return;
      }
    }

    // Prevent navigation if quality check is not completed
    if (currentStep === "review" && !qualityCheckCompleted) {
      toast({
        title: "Complete Quality Check First",
        description: "Please complete the quality check before proceeding.",
        variant: "destructive",
      });
      return;
    }

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
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Reset validation when new file is uploaded
    setResumeValidated(false);
    setResumeValidationError("");

    setFormData({ ...formData, resume: file });
    toast({
      title: "Resume uploaded! 📄",
      description: "Your resume has been successfully uploaded.",
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmitImprovements = async () => {
    if (!sopId) return;

    setLoading(true);

    try {
      const res = await sopService.improvementSuggestions(sopId, {
        improvement_answers: improvementAnswers,
      });

      // Check if API response indicates success
      if (res?.success || res?.message === "Final SOP generated successfully") {
        setQualityCheckCompleted(true);

        // toast({
        //   title: "Quality Check Complete! ✨",
        //   description: "Moving to payment step...",
        // });

        // Move to next step (payment)
        setTimeout(() => {
          setCurrentStep("payment");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
      } else {
        // Handle unsuccessful response
        console.error("Failed to generate final SOP:", res);
        toast({
          title: "Error",
          description:
            res?.message || "Failed to process improvements. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      // Handle any thrown errors
      console.error("Error submitting improvements:", err);
      toast({
        title: "Error",
        description: "An error occurred while processing improvements.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  function ReviewApplication({
    formData,
    onEdit,
    onConfirm,
  }: {
    formData: AppFormData;
    onEdit: (step: Step) => void;
    onConfirm: () => void;
  }) {
    const reviewSections = [
      {
        title: "Personal & Contact Details",
        icon: FileText,
        color: "from-blue-500 to-indigo-600",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        editStep: "university" as Step,
        content: [
          { label: "Full Name", value: formData.name },
          { label: "Email", value: formData.email },
          { label: "Phone", value: formData.phone },
          { label: "Country", value: formData.country },
          { label: "University", value: formData.university },
          { label: "Course", value: formData.course },
        ],
      },
      {
        title: "Resume",
        icon: Upload,
        color: "from-green-500 to-emerald-600",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        editStep: "resume" as Step,
        content: [
          {
            label: "File",
            value: formData.resume
              ? formData.resume.name
              : "No resume uploaded",
          },
        ],
      },
      {
        title: "Questionnaire Responses",
        icon: MessageCircle,
        color: "from-purple-500 to-pink-600",
        bgColor: "from-purple-50 to-pink-50",
        borderColor: "border-purple-200",
        editStep: "questions" as Step,
        content: formData.answers
          ? Object.entries(formData.answers).map(([key, value]) => ({
              label: key,
              value: typeof value === "string" ? value : "Not provided",
            }))
          : [{ label: "Responses", value: "No responses available" }],
      },
      // {
      //   title: "Quality Assessment",
      //   icon: Sparkles,
      //   color: "from-orange-500 to-red-600",
      //   bgColor: "from-orange-50 to-red-50",
      //   borderColor: "border-orange-200",
      //   editStep: "quality_check" as Step,
      //   content: [
      //     {
      //       label: "Quality Score",
      //       value: qualityScore
      //         ? `${qualityScore}/100`
      //         : "Assessment completed",
      //     },
      //   ],
      // },
    ];

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Check className="h-8 w-8 text-primary" />
            </div>

            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
              Review Your Application
            </h2>

            <p className="font-body text-muted-foreground">
              Please review all information before proceeding to payment
            </p>
          </motion.div>

          {/* REVIEW SECTIONS */}
          <div className="space-y-6">
            {reviewSections.map((section, index) => {
              const IconComponent = section.icon;

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="bg-card rounded-2xl p-6 border border-muted shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {/* SECTION HEADER */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>

                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {section.title}
                      </h3>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(section.editStep)}
                      className="rounded-xl border-muted font-body hover:scale-105 transition-all duration-200"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  {/* SECTION CONTENT */}
                  <div className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + itemIndex * 0.05 }}
                        className="bg-muted rounded-xl p-4 border border-muted"
                      >
                        <div className="flex flex-col space-y-2">
                          <span className="font-body text-sm font-medium text-muted-foreground">
                            Q: {item.label}
                          </span>

                          <span className="font-body text-sm text-foreground break-words pl-2 border-l-2 border-muted">
                            Ans: {item.value || "Not provided"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* SUMMARY CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-muted shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <Check className="h-5 w-5 text-primary" />
              </div>

              <h3 className="font-heading text-lg font-semibold text-foreground">
                Application Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                {
                  label: "Personal Info",
                  completed: !!(
                    formData.name &&
                    formData.email &&
                    formData.phone
                  ),
                },
                { label: "Resume", completed: !!formData.resume },
                { label: "Questionnaire", completed: !!formData.answers },
                { label: "Quality Check", completed: !!qualityScore },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-muted rounded-xl p-4 border border-muted"
                >
                  <div
                    className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      item.completed ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {item.completed ? (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <span className="text-muted-foreground text-sm">!</span>
                    )}
                  </div>

                  <p className="font-body text-xs font-medium text-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PROCEED BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={onConfirm}
              size="lg"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-heading font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Check className="h-5 w-5 mr-2" />
              Proceed to Quality Check
            </Button>
          </motion.div>
        </motion.div>
      </>
    );
  }

  const handlePayment = async () => {
    setIsPaymentLoading(true);

    const selectedPkg = packages[selectedPackage];
    const amount = selectedPkg.price;

    // ✅ Validate required fields
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
      // ✅ Load Razorpay SDK
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

      // ✅ Create Razorpay order from backend
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

      // ✅ Razorpay checkout options
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
            setPaymentProcessing(true);

            // ✅ Verify payment with backend
            const verify = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internal_receipt_id: order.internal_receipt_id,
            });

            // ✅ Proceed only if success === true
            if (verify?.success === true) {
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

              // ✅ Create lead entry
              const { lead } = await leadService.createLeads(payload);

              if (lead) {
                // ✅ Update SOP payment verification
                await sopService.verifyPayment(sopId!);

                // ✅ Mark payment as complete
                setPaymentCompleted(true);
                setPaymentProcessing(false);

                toast({
                  title: "Payment Successful! ✅",
                  description:
                    "Payment confirmed. Your SOP will be ready within 24–48 hours.",
                });

                // ✅ Move to next step (result)
                setTimeout(() => {
                  setCurrentStep("result");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 2000);
              } else {
                throw new Error("Failed to create lead.");
              }
            } else {
              throw new Error("Payment verification failed.");
            }
          } catch (error: any) {
            console.error("Payment processing error:", error);
            setPaymentProcessing(false);
            toast({
              title: "Error",
              description:
                error.message ||
                "Something went wrong during payment processing.",
              variant: "destructive",
            });
          }
        },
      };

      // ✅ Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      setIsPaymentLoading(false);
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsPaymentLoading(false);
    }
  };

  const stepTitles = {
    university: "Choose Your Destination ",
    resume: "Upload Your Resume ",
    questions: "Tell Us About Yourself ",
    review: " ",
    quality_check: "",
    payment: "",
    result: (
      <img src={GMILogo} alt="Global Minds India" className="h-12 mx-auto" />
    ),
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
          formData.course &&
          !validationErrors.name &&
          !validationErrors.email &&
          !validationErrors.phone
        );
      case "resume":
        return formData.resume !== null;
      case "questions":
        return sopId !== null; // SOP submitted successfully
      case "review":
        return reviewCompleted; // ✅ Review must be confirmed
      case "quality_check":
        return qualityCheckCompleted; // Quality check must be completed
      case "payment":
        return paymentCompleted;
      case "result":
        return paymentCompleted;
      default:
        return false;
    }
  };

  // ✅ Fixed: Updated progress step display to match actual steps
  const progressSteps = [
    { key: "university", label: "Personal Info.", index: 1 },
    { key: "resume", label: "Resume", index: 2 },
    { key: "questions", label: "Questionnaire", index: 3 },
    { key: "review", label: "Review", index: 4 }, // <- fix
    { key: "quality_check", label: "Quality Check", index: 5 },
    { key: "payment", label: "Payment", index: 6 },
    { key: "result", label: "SOP", index: 7 },
  ];

  const navigate = useNavigate();

  const handleCloseAndRedirect = () => {
    setAgreed(false);
    setShowInstructions(false);
    window.location.replace("/");
  };

  return (
    <>
      {showInstructions && (
        <AlertDialog
          open={showInstructions}
          onOpenChange={(open) => {
            if (!open && !isProceedingRef.current) {
              handleCloseAndRedirect(); // ❌ only for forced close
            }
          }}
        >
          <AlertDialogContent className="max-w-2xl w-[95vw] sm:w-[90vw] lg:w-full mx-auto max-h-[90vh] overflow-y-auto bg-card border border-muted shadow-2xl">
            <button
              onClick={handleCloseAndRedirect}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow transition"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* HEADER */}
              <AlertDialogHeader className="text-center pb-6">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-md"
                >
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </motion.div>

                <AlertDialogTitle className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  Important Guidelines
                </AlertDialogTitle>

                <p className="font-body text-sm sm:text-base text-muted-foreground mt-2">
                  Please read these instructions carefully to ensure the best
                  SOP quality
                </p>
              </AlertDialogHeader>

              {/* CONTENT */}
              <AlertDialogDescription asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* KEY REQUIREMENTS */}
                  <div className="bg-muted rounded-xl p-4 border border-muted shadow-sm">
                    <h4 className="font-heading font-semibold text-foreground mb-4">
                      Key Requirements
                    </h4>

                    <ul className="space-y-3">
                      {[
                        "Complete each step before moving on to the next",
                        "Ensure all required fields are filled accurately",
                        "The name entered must match the resume",
                        "Upload a clear, up-to-date resume in PDF format",
                        "Provide detailed and thoughtful responses",
                        "Avoid one-word or generic answers",
                        "Be honest and authentic",
                        "Use correct grammar and spelling",
                        "Review answers before final submission",
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.4 + index * 0.08,
                            duration: 0.3,
                          }}
                          className="flex items-start gap-3 bg-background border border-border rounded-lg p-3 shadow-sm"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-primary">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* WARNING NOTE */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="bg-muted border border-muted rounded-xl p-4"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-bold text-sm">
                          !
                        </span>
                      </div>

                      <p className="font-body text-sm text-primary">
                        Your Statement of Purpose will be generated entirely
                        based on your inputs. Please provide complete, accurate,
                        and meaningful responses.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </AlertDialogDescription>

              {/* CONSENT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="mt-6 border-t border-muted pt-6"
              >
                <div className="bg-muted border border-muted rounded-xl p-4">
                  <p className="font-body text-sm text-muted-foreground mb-4 flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Provide genuine and thoughtful responses.
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => setAgreed(!agreed)}
                  >
                    <div
                      className={`relative w-5 h-5 rounded border-2 transition-all ${
                        agreed
                          ? "bg-primary border-primary"
                          : "border-muted bg-card"
                      }`}
                    >
                      {agreed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>

                    <label className="font-body text-sm font-medium text-foreground cursor-pointer">
                      I agree and confirm.
                    </label>
                  </motion.div>
                </div>
              </motion.div>

              {/* CONTACT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="mt-6 border-t border-muted pt-6"
              >
                <div className="bg-muted border border-muted rounded-xl p-4">
                  <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                    <MessageCircle className="h-4 w-4 text-primary mr-2" />
                    Need Help? Contact Us
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    <a className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-muted shadow-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="font-body text-sm text-muted-foreground">
                        connect@globalmindsindia.com
                      </span>
                    </a>

                    <a className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-muted shadow-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-body text-sm text-muted-foreground">
                        7357446655
                      </span>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* ACTION */}
              <AlertDialogFooter className="mt-8">
                <AlertDialogAction
                  type="button" // ✅ THIS FIXES THE REFRESH
                  onClick={handleCloseInstructions}
                  disabled={!agreed}
                  className={`w-full py-3 rounded-xl font-heading font-semibold transition-all ${
                    agreed
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {agreed ? "Let's Get Started!" : "Please agree to continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Loader Overlay */}
      {(loading || polling || paymentProcessing) && (
        <>
          {loading && <Loader text="Processing..." />}
          {polling && (
            <Loader text="Performing quality check, please wait..." />
          )}
          {paymentProcessing && (
            <Loader text="Verifying payment, please wait..." />
          )}
        </>
      )}

      <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 bg-muted relative">
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-muted/60 backdrop-blur-sm" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          {/* Back to Home Button and Progress Steps Container */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            {/* Enhanced Back to Home Button */}
            <div>
              {currentStep === "university" ? (
                <Button
                  variant="ghost"
                  onClick={handleBackToHome}
                  className="font-body flex items-center gap-2 rounded-xl bg-card border border-muted hover:bg-muted transition"
                >
                  <Home className="h-4 w-4 text-primary" />
                  Back to Home
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="font-body flex items-center gap-2 rounded-xl bg-card border border-muted hover:bg-muted transition"
                    >
                      <Home className="h-4 w-4 text-primary" />
                      Back to Home
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-card border border-muted rounded-2xl shadow-xl max-w-md">
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTitle className="font-heading text-xl text-foreground">
                        Leave Application?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-body text-muted-foreground">
                        Your progress will be lost if you leave now.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="rounded-xl">
                        Continue
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBackToHome}
                        className="rounded-xl bg-primary text-primary-foreground"
                      >
                        Leave
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {/* Enhanced Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="bg-card rounded-3xl p-3 sm:p-4 shadow-xl border border-muted w-full max-w-5xl">
                <div className="flex items-start justify-between">
                  {progressSteps.map((step, index) => {
                    const isActive = currentStep === step.key;
                    const isCompleted = isStepComplete(step.key as Step);
                    const isPast =
                      progressSteps.findIndex((s) => s.key === currentStep) >
                      index;

                    return (
                      <div
                        key={step.key}
                        className="flex items-start flex-1 relative"
                      >
                        <motion.div
                          className="flex flex-col items-center w-full"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          {/* STEP BOX */}
                          <motion.div
                            className={`relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg 
                  flex items-center justify-center text-xs sm:text-sm font-bold 
                  transition-all duration-300 flex-shrink-0
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md scale-110"
                      : isCompleted || isPast
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                            whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isCompleted || isPast ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                              >
                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                              </motion.div>
                            ) : (
                              <span>{step.index}</span>
                            )}
                          </motion.div>

                          {/* STEP LABEL */}
                          <motion.div
                            className={`mt-1 sm:mt-2 text-[8px] sm:text-[10px] md:text-xs 
                  text-center font-medium transition-colors duration-300 
                  leading-tight max-w-[60px] sm:max-w-[80px]
                  ${
                    isActive
                      ? "text-primary"
                      : isCompleted || isPast
                      ? "text-primary/80"
                      : "text-muted-foreground"
                  }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            {step.label}
                          </motion.div>
                        </motion.div>

                        {/* CONNECTOR */}
                        {index < progressSteps.length - 1 && (
                          <div
                            className="absolute top-3 sm:top-4 md:top-5 flex items-center z-0 pointer-events-none"
                            style={{
                              left: "calc(50% + 25px)",
                              width: "calc(100% - 50px)",
                            }}
                          >
                            <motion.div
                              className="w-full flex items-center"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{
                                delay: index * 0.1 + 0.3,
                                duration: 0.4,
                              }}
                            >
                              <div className="w-full h-0.5 sm:h-1 bg-muted rounded-full" />
                              <motion.div
                                className={`absolute top-0 left-0 h-0.5 sm:h-1 rounded-full transition-all duration-500 ${
                                  isCompleted
                                    ? "bg-primary w-full"
                                    : "bg-muted w-0"
                                }`}
                                animate={{
                                  width: isCompleted ? "100%" : "0%",
                                }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                              />
                            </motion.div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <Card className="shadow-card bg-gradient-card border-0 animate-fade-in">
            <CardHeader className="text-center pb-4 sm:pb-6 md:pb-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {stepTitles[currentStep]}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-8">
              {/* ... All your existing step content remains the same ... */}
              {currentStep === "university" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* PERSONAL INFORMATION */}
                  <div className="bg-card rounded-2xl p-6 border border-muted">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          id: "name",
                          label: "Full Name",
                          type: "text",
                          placeholder: "Enter your full name",
                          value: formData.name,
                          key: "name",
                        },
                        {
                          id: "email",
                          label: "Email Address",
                          type: "email",
                          placeholder: "Enter your email address",
                          value: formData.email,
                          key: "email",
                        },
                        {
                          id: "phone",
                          label: "Phone Number",
                          type: "tel",
                          placeholder: "Enter your phone number",
                          value: formData.phone,
                          key: "phone",
                        },
                      ].map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor={field.id}
                            className="font-body text-sm font-medium text-foreground"
                          >
                            {field.label}{" "}
                            <span className="text-destructive">*</span>
                          </Label>

                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={
                              field.id === "phone"
                                ? "+91 Enter your phone number"
                                : field.placeholder
                            }
                            value={field.value}
                            onChange={(e) =>
                              handleInputChange(field.key, e.target.value)
                            }
                            className={`rounded-xl border-2 bg-card transition-all duration-200
                ${
                  validationErrors[field.key as keyof typeof validationErrors]
                    ? "border-destructive focus:border-destructive"
                    : "border-muted focus:border-primary"
                }`}
                            required
                          />

                          {validationErrors[
                            field.key as keyof typeof validationErrors
                          ] && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-destructive text-sm mt-1"
                            >
                              {
                                validationErrors[
                                  field.key as keyof typeof validationErrors
                                ]
                              }
                            </motion.p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ACADEMIC DETAILS */}
                  <div className="bg-card rounded-2xl p-6 border border-muted">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Academic Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* COUNTRY */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="space-y-2"
                      >
                        <Label className="font-body text-sm font-medium text-foreground">
                          Country <span className="text-destructive">*</span>
                        </Label>

                        <Select
                          value={formData.country || undefined}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              country: value,
                              university: "",
                              course: "",
                            });
                          }}
                        >
                          <SelectTrigger className="rounded-xl border-2 border-muted focus:border-primary bg-card transition-all duration-200">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>

                          <SelectContent
                            onScroll={(e) => {
                              const target = e.currentTarget;
                              if (
                                target.scrollTop + target.clientHeight >=
                                  target.scrollHeight - 10 &&
                                hasMoreCountries &&
                                !loadingCountries
                              ) {
                                loadCountries(countryPage);
                              }
                            }}
                          >
                            {countries.length === 0 && !loadingCountries ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                No countries available
                              </div>
                            ) : (
                              countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))
                            )}

                            {loadingCountries && (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Loading more...
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* UNIVERSITY */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="space-y-2"
                      >
                        <Label className="font-body text-sm font-medium text-foreground">
                          University
                        </Label>

                        <CreatableCombobox
                          country={formData.country}
                          type="university"
                          disabled={!formData.country}
                          value={formData.university}
                          onChange={(val) =>
                            setFormData({ ...formData, university: val })
                          }
                          options={universities}
                          placeholder="Search or create university"
                          loading={loadingUniversities}
                          onLoadMore={() => {
                            if (!loadingUniversities && hasMoreUniversities) {
                              loadUniversities(formData.country, uniPage);
                            }
                          }}
                          onSearchChange={(query) => {
                            if (formData.country && query.length > 1) {
                              debouncedUniSearch(query);
                            }
                          }}
                        />
                      </motion.div>

                      {/* COURSE */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        className="space-y-2 md:col-span-2"
                      >
                        <Label className="font-body text-sm font-medium text-foreground">
                          Course / Program
                        </Label>

                        <CreatableCombobox
                          country={formData.country}
                          type="course"
                          disabled={!formData.country}
                          value={formData.course}
                          onChange={(val) =>
                            setFormData({ ...formData, course: val })
                          }
                          options={courses}
                          placeholder="Search or create course"
                          loading={loadingCourses}
                          onLoadMore={() => {
                            if (!loadingCourses && hasMoreCourses) {
                              loadCourses(formData.country, coursePage);
                            }
                          }}
                          onSearchChange={(query) => {
                            if (formData.country && query.length > 1) {
                              debouncedCourseSearch(query);
                            }
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === "resume" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="bg-card rounded-2xl p-8 border border-muted">
                    {/* HEADER */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-center"
                    >
                      <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Upload className="h-10 w-10 text-primary" />
                      </div>

                      <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                        Upload Your Resume
                      </h3>
                      <p className="font-body text-muted-foreground mb-6">
                        Share your professional background with us
                      </p>
                    </motion.div>

                    {/* DROP ZONE */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                        formData.resume
                          ? "border-primary/40 bg-primary/5"
                          : isDragOver
                          ? "border-primary bg-primary/10 scale-105"
                          : "border-muted bg-card hover:border-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (!isDragOver) {
                          document.getElementById("resume-upload")?.click();
                        }
                      }}
                    >
                      {!formData.resume ? (
                        <>
                          <div className="space-y-4">
                            <motion.div
                              animate={isDragOver ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <Upload
                                className={`mx-auto h-16 w-16 transition-colors duration-300 ${
                                  isDragOver
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </motion.div>

                            <div>
                              <p
                                className={`text-lg font-medium transition-colors duration-300 ${
                                  isDragOver
                                    ? "text-primary"
                                    : "text-foreground"
                                }`}
                              >
                                {isDragOver
                                  ? "Drop your resume here!"
                                  : "Drag & drop your resume here"}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                or click to browse • PDF only up to 10MB
                              </p>
                            </div>
                          </div>

                          {/* DRAG OVERLAY */}
                          {isDragOver && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 border-2 border-primary rounded-2xl bg-primary/10 flex items-center justify-center"
                            >
                              <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-primary font-semibold text-lg"
                              >
                                📄 Drop to upload
                              </motion.div>
                            </motion.div>
                          )}

                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resume-upload"
                          />

                          <div className="mt-6 flex justify-center">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("resume-upload")
                                  ?.click();
                              }}
                              className="rounded-xl bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-all"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        </>
                      ) : (
                        /* UPLOADED STATE */
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Check className="h-8 w-8 text-primary" />
                          </div>

                          <div>
                            <p className="text-lg font-semibold text-primary">
                              Resume Uploaded Successfully!
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formData.resume.name}
                            </p>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("resume-upload")?.click();
                            }}
                            variant="outline"
                            className="rounded-xl"
                          >
                            Change File
                          </Button>

                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resume-upload"
                          />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* VALIDATION STATUS */}
                    {formData.resume && formData.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="mt-6 space-y-3"
                      >
                        {isValidatingResume && (
                          <div className="bg-muted rounded-xl p-4 border border-muted flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                            <p className="text-muted-foreground font-medium">
                              Validating resume name match...
                            </p>
                          </div>
                        )}

                        {!isValidatingResume && resumeValidated && (
                          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <p className="text-primary font-medium">
                              Resume validated successfully! Name matches.
                            </p>
                          </div>
                        )}

                        {!isValidatingResume && resumeValidationError && (
                          <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
                            <p className="text-destructive font-medium mb-1">
                              Validation Failed
                            </p>
                            <p className="text-destructive text-sm">
                              {resumeValidationError}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* TIPS */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="mt-6 bg-muted rounded-xl p-4 border border-muted"
                    >
                      <p className="font-medium text-foreground mb-2">
                        💡 Tips for best results:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Use a recent, updated resume</li>
                        <li>• Ensure all sections are clearly formatted</li>
                        <li>• Include relevant work experience and skills</li>
                        <li>• Ensure resume name matches the form name</li>
                      </ul>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {currentStep === "questions" && (
                <Questionnaire
                  formData={formData}
                  setFormData={setFormData}
                  onComplete={(answers) => handleQuestionnaireComplete(answers)}
                />
              )}

              {currentStep === "quality_check" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  {/* Quality Score Card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`rounded-2xl p-8 border text-center ${
                      qualityScore >= 75
                        ? "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-green-300"
                        : qualityScore <= 15
                        ? "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-red-200"
                        : "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                          qualityScore >= 75
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : qualityScore <= 15
                            ? "bg-gradient-to-r from-red-500 to-rose-600"
                            : "bg-gradient-to-r from-orange-500 to-amber-600"
                        }`}
                      >
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Quality Assessment
                      </h2>
                    </div>

                    {/* Circular Score */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-32 h-32">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <motion.circle
                            className={`${
                              qualityScore >= 75
                                ? "text-green-500"
                                : qualityScore >= 60
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                            strokeWidth="8"
                            strokeDasharray={`${
                              qualityScore ? qualityScore * 2.51 : 0
                            }, 251.2`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            initial={{ strokeDasharray: "0, 251.2" }}
                            animate={{
                              strokeDasharray: `${
                                qualityScore ? qualityScore * 2.51 : 0
                              }, 251.2`,
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div
                              className={`text-3xl font-bold ${
                                qualityScore >= 75
                                  ? "text-green-700"
                                  : qualityScore <= 15
                                  ? "text-red-700"
                                  : "text-gray-800"
                              }`}
                            >
                              {qualityScore}
                            </div>
                            <div className="text-sm text-gray-600">/ 100</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message based on score */}
                    {qualityScore <= 15 ? (
                      <p className="text-red-700 font-medium text-lg">
                        Your response was not that good. Please make necessary
                        changes in your answers, otherwise the SOP will be
                        generated based on your resume details.
                      </p>
                    ) : qualityScore >= 85 ? (
                      <p className="text-green-700 font-medium text-lg">
                        Excellent response! Your SOP quality is outstanding. 🎯
                      </p>
                    ) : qualityScore >= 75 ? (
                      <p className="text-green-700 font-medium text-lg">
                        Good response! You may proceed. 🌟
                      </p>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Your Response Quality Score
                        </p>
                        <p className="text-sm text-gray-600">
                          Let's enhance your responses for a stronger SOP
                        </p>
                      </>
                    )}
                  </motion.div>

                  {/* SCORE ≤ 15 → Proceed Anyway */}
                  {qualityScore <= 15 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="text-center"
                    >
                      <Button
                        onClick={handleSubmitImprovements}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Proceed Anyway
                      </Button>
                    </motion.div>
                  )}

                  {/* SCORE 75+ → Direct Proceed (NO questions) */}
                  {qualityScore >= 75 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="text-center"
                    >
                      <Button
                        onClick={handleSubmitImprovements}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Proceed
                      </Button>
                    </motion.div>
                  )}

                  {/* SCORE BETWEEN 16–74 → Enhancement Questions */}
                  {qualityScore > 15 && qualityScore < 75 && (
                    <>
                      {/* Info Banner */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3"
                      >
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">
                            ℹ
                          </span>
                        </div>
                        <p className="text-sm text-blue-900">
                          Please answer all the enhancement questions below to
                          improve your SOP quality and proceed to payment.
                        </p>
                      </motion.div>

                      {/* Enhancement Questions */}
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Enhancement Questions
                          </h3>
                          <p className="text-gray-600">
                            Please provide detailed answers to improve your SOP
                            quality
                          </p>
                        </div>

                        {qualityQuestions.map((q, index) => (
                          <motion.div
                            key={q}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.3 + index * 0.1,
                              duration: 0.4,
                            }}
                            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white font-bold text-sm">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1 space-y-3">
                                <Label className="text-base font-medium text-gray-800 leading-relaxed">
                                  {q}
                                </Label>
                                <Textarea
                                  value={improvementAnswers[q] || ""}
                                  onChange={(e) =>
                                    setImprovementAnswers((m) => ({
                                      ...m,
                                      [q]: e.target.value,
                                    }))
                                  }
                                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50 hover:bg-white"
                                  rows={4}
                                  placeholder="Share your detailed thoughts and experiences here..."
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Submit Improvements */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="text-center"
                      >
                        <Button
                          onClick={handleSubmitImprovements}
                          disabled={
                            !Object.values(improvementAnswers).every((v) =>
                              v?.trim()
                            ) || loading
                          }
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="h-5 w-5 mr-2" />
                              Submit Improvements
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}

              {currentStep === "review" && (
                <ReviewApplication
                  formData={formData}
                  onEdit={(step) => {
                    setCurrentStep(step);
                  }}
                  onConfirm={handleReviewConfirm} // ✅ Pass the new function here
                />
              )}

              {currentStep === "payment" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  {/* HEADER */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <CreditCard className="h-8 w-8 text-primary" />
                    </div>

                    <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                      Secure Payment
                    </h2>

                    <p className="font-body text-muted-foreground">
                      Complete your SOP generation with our expert package
                    </p>
                  </motion.div>

                  {/* PACKAGE CARD */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="relative max-w-2xl mx-auto"
                  >
                    <div className="bg-card rounded-3xl p-8 border border-muted shadow-xl">
                      {/* PACKAGE HEADER */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                          </div>

                          <h3 className="font-heading text-2xl font-bold text-foreground">
                            {packages.expert.name}
                          </h3>
                        </div>

                        {/* PRICING */}
                        <div className="flex items-center justify-center space-x-3 mb-6">
                          {couponApplied && (
                            <span className="text-xl font-semibold text-muted-foreground line-through">
                              ₹{originalPrice.toLocaleString()}
                            </span>
                          )}

                          <span className="text-4xl font-bold text-primary">
                            ₹{discountedPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* FEATURES */}
                      <div className="mb-8">
                        <h4 className="font-heading text-lg font-semibold text-foreground mb-4 text-center">
                          What's Included
                        </h4>

                        <div className="space-y-3">
                          {packages.expert.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex items-start bg-muted rounded-xl p-4 border border-muted"
                            >
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>

                              <span className="font-body text-muted-foreground font-medium">
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* COUPON */}
                      <div className="bg-muted rounded-2xl p-6 border border-muted mb-6">
                        <h4 className="font-heading text-lg font-semibold text-foreground mb-4 text-center">
                          Have a Coupon Code?
                        </h4>

                        {!couponApplied ? (
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Input
                                value={couponCode}
                                onChange={(e) => {
                                  setCouponCode(e.target.value);
                                  setCouponError("");
                                }}
                                placeholder="Enter coupon code"
                                className="flex-1 rounded-xl border-2 border-muted focus:border-primary"
                              />

                              <Button
                                onClick={handleCouponApply}
                                disabled={!couponCode.trim()}
                                className="px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                Apply
                              </Button>
                            </div>

                            {couponError && (
                              <p className="text-destructive text-sm text-center">
                                {couponError}
                              </p>
                            )}

                            <div
                              className="text-center p-3 bg-card rounded-xl border border-muted cursor-pointer hover:bg-muted"
                              onClick={() => {
                                setCouponCode("GMI10");
                                setCouponApplied(true);
                              }}
                            >
                              <p className="text-sm text-muted-foreground">
                                Try our coupon:
                              </p>
                              <p className="text-lg font-bold text-primary">
                                GMI10
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Click to apply 10% discount
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-3">
                            <p className="font-semibold text-primary">
                              Coupon “GMI10” Applied
                            </p>

                            <Button
                              onClick={handleCouponRemove}
                              variant="outline"
                              size="sm"
                            >
                              Remove Coupon
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* PRICE SUMMARY */}
                      <div className="bg-muted rounded-2xl p-6 border border-muted mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Amount
                            </p>
                            <p className="text-xs text-muted-foreground">
                              (Inclusive of GST)
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                              ₹{discountedPrice.toLocaleString()}
                            </p>

                            {couponApplied && (
                              <p className="text-sm text-primary font-medium">
                                You save ₹
                                {(
                                  originalPrice - discountedPrice
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SECURITY */}
                      <div className="flex items-center justify-center mb-6 p-3 bg-muted rounded-xl border border-muted">
                        <Shield className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Secured with SSL encryption
                        </span>
                      </div>

                      {/* PAY BUTTON */}
                      {!paymentCompleted ? (
                        <Button
                          onClick={handlePayment}
                          disabled={isPaymentLoading}
                          size="lg"
                          className="w-full py-4 text-lg rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
                        >
                          {isPaymentLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-3 h-6 w-6" />
                              Pay ₹{discountedPrice.toLocaleString()} & Generate
                              SOP
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="text-center p-6 bg-muted rounded-2xl border border-muted">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-primary-foreground" />
                          </div>

                          <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                            Payment Successful!
                          </h3>

                          <p className="font-body text-muted-foreground">
                            Your SOP generation has started. You’ll receive it
                            within 24–48 hours.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === "result" && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto p-4">
                  <Card className="relative bg-card rounded-2xl border border-muted shadow-2xl overflow-hidden">
                    {/* Ambient background blobs */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 blur-2xl rounded-full animate-pulse pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-primary/5 blur-xl rounded-full animate-blob pointer-events-none" />

                    {/* Success Icon */}
                    <div className="flex justify-center mt-8 relative z-10">
                      <div className="flex items-center justify-center bg-primary w-20 h-20 rounded-full shadow-lg animate-bounce-slow">
                        <svg
                          className="w-12 h-12 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={4}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <CardHeader className="text-center relative z-10">
                      <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-6">
                        We’ve received your request
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center relative z-10">
                      <p className="font-body text-base sm:text-lg text-muted-foreground">
                        Your SOP is now being carefully crafted by our experts
                        to match your academic profile and goals.
                      </p>

                      <p className="font-body text-base sm:text-lg text-muted-foreground">
                        You will receive your professionally written SOP via
                        email within{" "}
                        <span className="font-semibold text-primary animate-pulse">
                          1–2 working days
                        </span>
                        .
                      </p>

                      {/* Contact Section */}
                      <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="font-body text-sm sm:text-base text-muted-foreground">
                          Need help? Reach out to us anytime:
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 w-full sm:w-auto border-muted hover:bg-muted transition-all"
                            asChild
                          >
                            <a href="mailto:connect@globalmindsindia@gmail.com">
                              <Mail className="w-5 h-5 text-primary" />
                              connect@globalmindsindia@gmail.com
                            </a>
                          </Button>

                          <Button
                            variant="outline"
                            className="flex items-center gap-2 w-full sm:w-auto border-muted hover:bg-muted transition-all"
                            asChild
                          >
                            <a href="tel:+917353446655">
                              <Phone className="w-5 h-5 text-primary" />
                              +91 7353446655
                            </a>
                          </Button>
                        </div>

                        {/* Home Button */}
                        <Button
                          className="mt-6 px-8 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-xl shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
                          onClick={() => (window.location.href = "/")}
                        >
                          Go to Home
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Animations */}
                  <style>{`
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      .animate-bounce-slow {
        animation: bounce-slow 2.5s infinite;
      }

      @keyframes blob {
        0%, 100% { transform: scale(1) translate(0,0); }
        33% { transform: scale(1.1) translate(-8px, 8px); }
        66% { transform: scale(0.9) translate(8px, -4px); }
      }
      .animate-blob {
        animation: blob 6s infinite;
      }
    `}</style>
                </div>
              )}

              {/* ✅ Fixed: Updated Navigation Buttons Logic - Hide during questionnaire */}
              {currentStep !== "result" && currentStep !== "questions" && (
                <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 md:pt-8 gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === "university"}
                    className="rounded-xl w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === "payment" ? (
                    <div></div>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={
                        !isStepComplete(currentStep) ||
                        polling ||
                        isValidatingResume
                      }
                      className="rounded-xl w-full sm:w-auto"
                    >
                      {polling ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Loading...
                        </>
                      ) : isValidatingResume ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Validating...
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Floating Help Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowHelp(true)}
            className="relative rounded-full p-4 bg-primary text-primary-foreground
                 shadow-xl hover:shadow-2xl transition-all border border-primary/30"
          >
            {/* Pulse */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <MessageCircle className="h-5 w-5" />
              </motion.div>
              <span className="font-semibold">Help</span>
            </div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Help Dialog */}
      {showHelp && (
        <AlertDialog open onOpenChange={setShowHelp}>
          <AlertDialogContent className="max-w-md w-[95vw] mx-auto bg-card border border-border shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <AlertDialogHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MessageCircle className="h-8 w-8 text-primary-foreground" />
                </div>

                <AlertDialogTitle className="text-2xl font-heading font-bold text-foreground">
                  Customer Support
                </AlertDialogTitle>

                <p className="font-body text-muted-foreground mt-2">
                  We’re here to help you succeed
                </p>
              </AlertDialogHeader>

              <AlertDialogDescription asChild>
                <div className="space-y-6">
                  {/* Contact Card */}
                  <div className="bg-muted rounded-xl p-6 border border-border">
                    <p className="text-center text-foreground font-medium mb-6">
                      Need assistance? Reach us anytime.
                    </p>

                    <div className="space-y-4">
                      {/* Email */}
                      <a
                        href="mailto:connect@globalmindsindia.com"
                        className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">
                            Email Support
                          </p>
                          <p className="text-sm text-muted-foreground break-all">
                            connect@globalmindsindia.com
                          </p>
                        </div>
                      </a>

                      {/* Phone */}
                      <a
                        href="tel:+917353446655"
                        className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">
                            Phone Support
                          </p>
                          <p className="text-sm text-muted-foreground">
                            +91 7353446655
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-muted rounded-xl p-4 border border-border">
                    <div className="flex items-center mb-3">
                      <Sparkles className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-semibold text-foreground">
                        Quick Tips
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                        Response time: 2–4 hours
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                        Mon–Sat, 9 AM – 7 PM
                      </li>
                    </ul>
                  </div>
                </div>
              </AlertDialogDescription>

              {/* Footer */}
              <AlertDialogFooter className="mt-8">
                <AlertDialogAction
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 rounded-xl font-heading font-semibold
                       bg-primary text-primary-foreground hover:bg-primary/90
                       shadow-lg transition-all"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Got it, Thanks!
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
