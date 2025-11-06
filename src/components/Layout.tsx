import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/?generator=true");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onGetStarted={handleGetStarted} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
