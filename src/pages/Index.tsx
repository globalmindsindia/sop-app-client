import { useState } from "react";
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
  const [showGenerator, setShowGenerator] = useState(false);

  if (showGenerator) {
    return <SOPGenerator />;
  }

  return (
    <div className="min-h-screen">
      <Header onGetStarted={() => setShowGenerator(true)} />
      <Hero onGetStarted={() => setShowGenerator(true)} />
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
