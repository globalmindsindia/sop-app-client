import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Accuracy from "@/components/Accuracy";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SOPGenerator from "@/components/SOPGenerator";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (searchParams.get("generator") === "true") {
      setShowGenerator(true);
    }
  }, [searchParams]);

  const handleGetStarted = () => {
    setShowGenerator(true);
    setSearchParams({ generator: "true" });
  };

  if (showGenerator) {
    return <SOPGenerator />;
  }

  return (
    <div className="pt-16">
      <Header onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <HowItWorks />
      <Accuracy />
      <FAQSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
