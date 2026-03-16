import {
  Phone,
  Check,
  X,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCheck,
  FileText,
  GraduationCap,
  Wallet,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import companyLogo from "@/assets/gmi_logo.png";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { leadService } from "@/services/leadService";
import { sopService } from "@/services/sopService";
import { loadRazorpayScript } from "@/utils/razorpay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    fbq: any;
  }
}

export default function SOPForms() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sopId, setSopId] = useState<number | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const originalPrice = 1299;
  const discountedPrice = couponApplied
    ? Math.round(originalPrice * 0.9)
    : originalPrice;

  const testimonials = [
    {
      name: "Sandhya Venaktesh",
      initials: "SV",
      rating: 5,
      text: "I can confidently say that Global Minds India's SOP Creator was a total game-changer for my university application! I was initially nervous about writing my Statement of Purpose, but the tool made everything so simple and structured. It guided me step-by-step and gave me clarity I didn't have before.",
    },
    {
      name: "Preethi Elango",
      initials: "PE",
      rating: 5,
      text: "I had a great experience getting my SOP prepared here. The team was very professional and took the time to understand my background and goals before drafting. They presented my profile in a very clear and compelling manner, highlighting my strengths effectively.",
    },
    {
      name: "Rachana",
      initials: "RS",
      rating: 4,
      text: "Writing my SOP felt overwhelming at first, but Global Minds India's SOP Creator completely changed the game! The platform was super easy to use and helped me organize my thoughts beautifully. I loved how it gave personalized prompts that made writing easier.",
    },
    {
      name: "Ujwal",
      initials: "U",
      rating: 4,
      text: "Global Minds India's SOP Creator made my entire application journey effortless! I was amazed at how the tool helped me frame my goals and experiences in such a clear, powerful way. It saved me so much time and removed all the guesswork from writing.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is an SOP and why is it important?",
      answer:
        "An SOP (Statement of Purpose) is a crucial document that explains your academic background, career goals, and reasons for choosing a specific program and university. It's often the deciding factor in admissions as it showcases your clarity, motivation, and fit for the program.",
    },
    {
      question: "How long does it take to get my SOP written?",
      answer:
        "Our typical SOP creation process takes 5-7 business days. This includes a detailed profile interview, multiple drafts, expert reviews, and revisions based on your feedback. Rush services are available for urgent applications.",
    },
    {
      question: "Do you customize SOPs for different universities?",
      answer:
        "Yes, absolutely! Each SOP is tailored to the specific university and program you're applying to. We research the university's values, program requirements, and admission criteria to align your profile perfectly with their expectations.",
    },
    {
      question: "What makes Global Minds India's SOP service different?",
      answer:
        "We specialize in Germany and Europe admissions with in-house experts (no freelancers). Our SOPs are visa-aligned, plagiarism-free, and written from an admission committee's perspective. We focus on strategic storytelling rather than generic templates.",
    },
    {
      question: "Can I get revisions if I'm not satisfied with the SOP?",
      answer:
        "Yes! We offer multiple rounds of revisions until you're completely satisfied. Our goal is to create an SOP that truly represents your profile and maximizes your admission chances. Your success is our priority.",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Meta Pixel initialization
  useEffect(() => {
    if (!window.fbq) {
      const script = document.createElement("script");
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;
        n.push=n;
        n.loaded=!0;
        n.version='2.0';
        n.queue=[];
        t=b.createElement(e);
        t.async=!0;
        t.src=v;
        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}
        (window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '4104271809716592');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.src =
        "https://www.facebook.com/tr?id=4104271809716592&ev=PageView&noscript=1";
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  // Validation functions
  const validateName = (value: string): string | null => {
    if (value.length < 3) return "Name must be at least 3 characters";
    if (/\d/.test(value)) return "Name should not contain numbers";
    return null;
  };

  const validateEmail = (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return null;
  };

  const validatePhone = (value: string): string | null => {
    const cleanPhone = value.replace(/^\+91\s*/, "");
    if (cleanPhone.length !== 10) return "Phone must be 10 digits";
    if (!/^[6-9]/.test(cleanPhone)) return "Phone must start with 6-9";
    if (!/^\d+$/.test(cleanPhone)) return "Phone should contain only digits";
    return null;
  };

  const handleNameChange = (value: string) => {
    const cleaned = value.replace(/\d/g, "");
    setName(cleaned);
    const error = validateName(cleaned);
    setErrors((prev) => ({ ...prev, name: error || undefined }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setErrors((prev) => ({ ...prev, email: error || undefined }));
  };

  const handlePhoneChange = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned && !cleaned.startsWith("+91")) {
      cleaned = "+91 " + cleaned;
    } else if (cleaned.startsWith("+91")) {
      const digits = cleaned.substring(3);
      cleaned = "+91 " + digits;
    }
    setPhone(cleaned);
    const error = validatePhone(cleaned);
    setErrors((prev) => ({ ...prev, phone: error || undefined }));
  };

  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === "GMI10") {
      setCouponApplied(true);
      toast({
        title: "Coupon Applied! 🎉",
        description: "10% discount has been applied.",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): boolean => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);

    setErrors({
      name: nameError || undefined,
      email: emailError || undefined,
      phone: phoneError || undefined,
    });

    if (nameError || emailError || phoneError) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before proceeding.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsPaymentLoading(true);
    const amount = discountedPrice;

    const cleanPhone = phone.replace(/^\+91\s*/, "").replace(/\s/g, "");
    const formattedPhone = "+91" + cleanPhone;

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

      // Create Razorpay order from backend
      const order = await paymentService.createOrder({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
        amount: amount,
        description: "SOP Generation Service - ₹" + amount,
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
          name: name.trim(),
          email: email.trim(),
          contact: cleanPhone,
        },
        theme: { color: "#3B82F6" },

        handler: async function (response: PaymentResponse) {
          try {
            // Verify payment with backend
            const verify = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internal_receipt_id: order.internal_receipt_id,
            });

            // Proceed only if success === true
            if (verify?.success === true) {
              const sopPayload = {
                name: name.trim(),
                email: email.trim(),
                phone: formattedPhone,
                country: "Instagram Ads",
                university: "Instagram Ads Lead",
                course: "SOP Expert Service",
                answers: {
                  "Lead Source": "Instagram Ads Page",
                  "Message": message.trim() || "No message provided",
                },
              };

              const fd = new FormData();
              fd.append("data", JSON.stringify(sopPayload));
              
              const blob = new Blob(["Instagram Ads Lead - No Resume Uploaded"], { type: "application/pdf" });
              fd.append("resume", blob, "instagram_lead.pdf");

              const { id } = await sopService.submitSop(fd);
              setSopId(id);

              if (id) {
                await sopService.verifyPayment(id);
              }

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
                name: name.trim(),
                email: email.trim(),
                phoneNumber: formattedPhone,
                serviceType: "SOP Expert",
                leadSource: "SOP_INSTA_ADS_PAGE",
                userNotes:
                  message.trim() || `SOP Service Payment - Amount: ₹${amount}`,
                purpose: "SOP_GENERATION",
                serviceName: "SOP Expert",
                purchaseDate: formatted,
                paymentAmount: amount,
                domainUrl: window.location.origin,
              };

              try {
                const leadResponse = await leadService.createLeads(payload);
                console.log("Lead created successfully:", leadResponse);
              } catch (leadError) {
                console.error("Lead creation failed:", leadError);
              }

              // Track Purchase event with Meta Pixel
              if (window.fbq) {
                window.fbq("track", "Purchase", {
                  value: amount,
                  currency: "INR",
                });
              }

              // Show success modal
              setShowSuccessModal(true);

              toast({
                title: "Payment Successful! ✅",
                description:
                  "Your SOP slot has been successfully booked. Our team will contact you shortly.",
              });
            } else {
              throw new Error("Payment verification failed.");
            }
          } catch (error: any) {
            console.error("Payment processing error:", error);
            toast({
              title: "Error",
              description:
                error.message ||
                "Something went wrong during payment processing.",
              variant: "destructive",
            });
          } finally {
            setIsPaymentLoading(false);
          }
        },
      };

      // Open Razorpay modal
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

  const handleCTAClick = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex-shrink-0">
              <img
                src={companyLogo}
                alt="Global Minds India"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <a
              href="tel:+917353446655"
              className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold">
                +91 7353446655
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 md:pt-16">
        <img
          src="/hero_section_inst_ads.png"
          alt="SOP Insta Ads Hero Section"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </section>

      {/* Section 1 - What is SOP */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              What is SOP ?
            </h2>

            <div className="mb-8 text-lg text-gray-600">
              <p>
                SOP (Statement of Purpose) is a structured personal essay
                required for university admissions in India and abroad.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Required for Germany, Europe, USA, UK, Canada",
                "Mandatory for Indian MBA / PG Programs",
                "Explains career direction clearly",
                "Aligns your profile with university goals",
                "Strengthens visa and scholarship chances",
                "Evaluated before admission shortlisting",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-green-50 rounded-xl px-6 py-4 flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Why SOP is Critical */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Why SOP is Critical
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <Card className="border-2 border-red-200 bg-red-50/50 shadow-card">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-2xl font-bold text-red-700 mb-6">
                  A weak SOP leads to:
                </h3>
                <div className="space-y-4">
                  {[
                    "Direct rejection",
                    "Visa risk",
                    "Scholarship rejection",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <X className="h-6 w-6 text-red-600 flex-shrink-0" />
                      <span className="text-lg text-red-900 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 bg-green-50/50 shadow-card">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-2xl font-bold text-green-700 mb-6">
                  A strong SOP increases:
                </h3>
                <div className="space-y-4">
                  {[
                    "Admission probability",
                    "Scholarship chances",
                    "Visa confidence",
                    "Academic credibility",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <span className="text-lg text-green-900 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-xl text-center text-foreground font-semibold">
            Admissions committee reads SOP before shortlisting.
          </p>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Build a Powerful SOP That Gets University Attention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <UserCheck className="h-10 w-10 text-blue-600 mb-4" />
              <span className="text-lg font-semibold text-foreground">
                Free profile evaluation
              </span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <FileText className="h-10 w-10 text-blue-600 mb-4" />
              <span className="text-lg font-semibold text-foreground">
                SOP structure consultation
              </span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <GraduationCap className="h-10 w-10 text-blue-600 mb-4" />
              <span className="text-lg font-semibold text-foreground">
                University alignment guidance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Abroad vs India SOP */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            SOP for Abroad vs Indian Universities
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600">
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-base sm:text-lg md:text-xl font-bold text-white w-1/2">
                      Abroad SOP Focus
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-base sm:text-lg md:text-xl font-bold text-white w-1/2">
                      Indian University SOP Focus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Research interest
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Academic background
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Academic depth
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Leadership exposure
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Career alignment
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Management potential
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Country relevance
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Work experience
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Long-term impact
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700">
                      • Professional clarity
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold text-foreground text-center mt-4 md:mt-6">
            Most students don't know this difference. We do.
          </p>
        </div>
      </section>

      {/* Section 4 - Our Unique SOP Process */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Our 7-Step SOP Framework
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4 mb-6">
            {[
              "60-minute deep profile interview",
              "Academic journey mapping",
              "Career gap clarification",
              "University-specific alignment",
              "Country research integration",
              "3-level expert review",
              "Plagiarism & tone calibration",
            ].map((step, index) => (
              <Card
                key={index}
                className="border-0 shadow-card bg-white hover:shadow-hover transition-all duration-300"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-foreground font-medium pt-2">{step}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center space-y-3">
            <p className="text-xl font-bold text-foreground">
              We DIG deeper than what you normally explain.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 - Why We Are Experts */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Why Global Minds India SOP Strategy Works
          </h2>

          <div className="space-y-4 sm:space-y-3 md:space-y-4">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                Germany & Europe Specialization
              </h3>
              <p className="text-white text-opacity-90 text-base md:text-lg">
                Deep understanding of admission expectations across public
                universities.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                In-House SOP Experts
              </h3>
              <p className="text-white text-opacity-90 text-base md:text-lg">
                No freelancers. No outsourced writing. Complete quality control
                internally.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                Visa-Aligned Writing Approach
              </h3>
              <p className="text-white text-opacity-90 text-base md:text-lg">
                Structured to strengthen both admission and visa credibility.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                Admission Committee Perspective
              </h3>
              <p className="text-white text-opacity-90 text-base md:text-lg">
                We write based on what evaluators actually look for.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                Strategic Profile Storytelling
              </h3>
              <p className="text-white text-opacity-90 text-base md:text-lg">
                Logical narrative positioning that aligns academics with career
                clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 - The Difference We Make */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            The Difference We Make
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-center text-base sm:text-lg md:text-xl font-bold text-white w-1/2 bg-red-600">
                      Others
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-base sm:text-lg md:text-xl font-bold text-white w-1/2 bg-green-600">
                      Global Minds India
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-red-50">
                      <span className="inline-flex items-center gap-2">❌ Copy-paste templates</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-green-50">
                      <span className="inline-flex items-center gap-2">✅ Strategic narrative</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-red-50">
                      <span className="inline-flex items-center gap-2">❌ AI generic writing</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-green-50">
                      <span className="inline-flex items-center gap-2">✅ Data-backed clarity</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-red-50">
                      <span className="inline-flex items-center gap-2">❌ No university customization</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-green-50">
                      <span className="inline-flex items-center gap-2">✅ Structured argument</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-red-50"></td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 sm:py-3 text-sm sm:text-base md:text-lg text-gray-700 bg-green-50">
                      <span className="inline-flex items-center gap-2">✅ Personalized positioning</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold text-foreground text-center mt-4 md:mt-6">
            We convert confusion into clarity.
          </p>
        </div>
      </section>

      {/* Fee Structure Section */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-gray-50 rounded-2xl border border-yellow-600 shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Wallet className="h-8 w-8 text-yellow-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                Fee Structure
              </h2>
            </div>

            <div className="bg-green-50 rounded-xl p-6 md:p-8 text-center mb-4">
              <p className="text-5xl md:text-6xl font-bold text-green-600 mb-2">
                ₹1,299
              </p>
              <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
                Service Charge
              </p>
              <p className="text-sm text-red-600 font-medium">Non-refundable</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-sm md:text-base text-orange-800">
                SOP service fees are non-refundable under any circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Real Results. Real Students.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-center">
            See how students transformed their SOP journey with Global Minds
            India.
          </p>

          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mx-auto max-w-3xl">
                      <CardContent className="p-4 sm:p-6 md:p-8 relative">
                        <Quote className="absolute top-4 right-4 h-8 w-8 text-gray-300" />
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg flex-shrink-0">
                            {testimonial.initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-foreground">
                              {testimonial.name}
                            </h4>
                            <div className="flex gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < testimonial.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-300 text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 italic text-base leading-relaxed">
                          "{testimonial.text}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-center">
            Got questions? We've got answers.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-base md:text-lg text-foreground pr-3">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 text-sm md:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-sm text-center text-gray-700 mb-1">
            Enroll now to get Additional{" "}
            <span className="font-bold">10% discount</span>.
          </p>
          <Button
            onClick={handleCTAClick}
            className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 shadow-lg hover:shadow-xl transition duration-300"
          >
            Book Your SOP Slot
          </Button>
          <p className="text-xs text-center text-gray-600 mt-2">
            By Accepting Terms &amp; Condition, Proceed To Payment.
          </p>
        </div>
      </div>

      {/* Booking Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Book Your SOP Slot
            </DialogTitle>
            <DialogDescription className="text-center">
              Fill in your details to proceed with payment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+91 Enter your phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any specific requirements or questions?"
                rows={3}
              />
            </div>

            {/* Coupon Field */}
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter GMI10 for 10% off"
                  disabled={couponApplied}
                />
                {!couponApplied ? (
                  <Button
                    onClick={handleCouponApply}
                    disabled={!couponCode.trim()}
                    variant="outline"
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setCouponApplied(false);
                      setCouponCode("");
                    }}
                    variant="outline"
                  >
                    Remove
                  </Button>
                )}
              </div>
              {couponApplied && (
                <p className="text-green-600 text-sm font-medium">
                  ✓ Coupon applied! You saved upto ₹
                  {originalPrice - discountedPrice}
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {couponApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="line-through text-gray-500">
                    ₹{originalPrice}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-green-600">
                  ₹{discountedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              onClick={handlePayment}
              disabled={isPaymentLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
            >
              {isPaymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Pay ₹{discountedPrice.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              {name ? `Congratulations, ${name}!` : "Congratulations!"}
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-4 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your SOP slot has been successfully booked. A confirmation email
                has been sent to{" "}
                <span className="font-medium text-gray-900">{email}</span>. Our
                team will contact you shortly.
              </p>

              <div className="pt-4 border-t border-gray-200 mt-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  For more information, contact us at:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Mail:</span>{" "}
                    <a
                      href="mailto:connect@globalmindsindia.com"
                      className="text-blue-600 hover:underline"
                    >
                      connect@globalmindsindia.com
                    </a>
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    <a
                      href="tel:+917353446655"
                      className="text-blue-600 hover:underline"
                    >
                      +91 7353446655
                    </a>
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setShowForm(false);
                window.location.reload();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setShowForm(false);
              }}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
