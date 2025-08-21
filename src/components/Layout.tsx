import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onGetStarted={() => {}} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
