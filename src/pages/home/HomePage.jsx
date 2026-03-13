import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ProgramsSection from "./ProgramsSection";
import HowItWorksSection from "./HowItWorksSection";
import ContactSection from "./ContactSection";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import ForgotPasswordModal from "../auth/ForgotPasswordModal";

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main>
        <HeroSection
          onApplyClick={() => setShowRegister(true)}
          onLearnMoreClick={() => {
            const el = document.getElementById("about");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <AboutSection />
        <ProgramsSection onApplyClick={() => setShowRegister(true)} />
        <HowItWorksSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => setShowRegister(true)}
        onSwitchToForgotPassword={() => setShowForgotPassword(true)}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowLogin(true)}
      />
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSwitchToLogin={() => setShowLogin(true)}
      />
    </div>
  );
};

export default HomePage;
