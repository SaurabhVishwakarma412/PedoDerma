// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle, Clock, Shield, Video, MessageSquare, Star, ArrowRight,
  UsersRound, Stethoscope, UserStar, BriefcaseMedical, Camera,
  Sparkles, Heart, Award, Zap, ShieldCheck, Calendar, Smile,
  Droplets, Wind, Baby, Gem, Bug, AlertCircle,
} from "lucide-react";

import doctor4 from "../assets/doctor4.jpg";
import TestimonialCarousel from "../components/TestimonialCarousel";

// Animated Counter Component with enhanced styling
const AnimatedCounter = ({ number, label, icon, desc, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const themeObserver = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let start = 0;
      const end = parseInt(number);
      const duration = 2000;
      const increment = end / (duration / 16);

      const counterTimer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counterTimer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counterTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, number, delay]);

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
        darkMode 
          ? "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/90 backdrop-blur-sm border border-cyan-300/10 shadow-xl shadow-black/30 hover:border-cyan-300/25 hover:shadow-cyan-950/40"
          : "bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl border border-gray-100"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative p-8 text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 mb-5 rounded-2xl shadow-lg transform group-hover:scale-110 transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-blue-600 to-indigo-700"
            : "bg-gradient-to-br from-blue-500 to-indigo-600"
        }`}>
          <div className="text-white text-3xl">{icon}</div>
        </div>
        <div className={`text-5xl font-extrabold mb-2 ${
          darkMode
            ? "bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        }`}>
          {count}
          {number.includes("+") ? "+" : number.includes("%") ? "%" : ""}
        </div>
        <div className={`text-xl font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{label}</div>
        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{desc}</div>
      </div>
    </div>
  );
};





// Feature Card Component - CORRECTED
const FeatureCard = ({ title, desc, icon: Icon, gradient, darkMode }) => (
  <div className={`group relative rounded-2xl transition-all duration-500 overflow-hidden ${
    darkMode 
      ? "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/90 backdrop-blur-sm border border-cyan-300/10 shadow-xl shadow-black/30 hover:border-cyan-300/25 hover:shadow-cyan-950/40 hover:-translate-y-2"
      : "bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
  }`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500`}></div>
    <div className="relative p-8 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300 ${
        darkMode
          ? `bg-gradient-to-br ${gradient}`
          : `bg-gradient-to-br ${gradient}`
      }`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h3>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</p>
    </div>
  </div>
);

// Condition Card Component - CORRECTED
const ConditionCard = ({ condition, icon: Icon, lightColor, darkColor, lightBorder, darkBorder, lightIcon, darkIcon, darkMode }) => (
  <div
    className={`group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
      darkMode 
        ? `${darkColor} ${darkBorder} hover:shadow-lg`
        : `${lightColor} ${lightBorder} hover:shadow-lg`
    }`}
  >
    <div className="flex items-center gap-4">
      <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${
        darkMode ? darkIcon : lightIcon
      }`} />
      <div>
        <h3 className={`font-semibold text-lg ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{condition}</h3>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Consult a specialist online</p>
      </div>
    </div>
  </div>
);

// Step Card Component - CORRECTED
const StepCard = ({ step, title, desc, icon: Icon, gradient, darkMode }) => (
  <div className="relative">
    <div className={`rounded-2xl shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/90 backdrop-blur-sm border border-cyan-300/10 shadow-black/30 hover:border-cyan-300/25 hover:shadow-cyan-950/40 hover:shadow-2xl"
        : "bg-white border border-gray-100 hover:shadow-2xl"
    }`}>
      <div className="relative mb-6">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full blur-xl opacity-30`}></div>
        <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${gradient} rounded-full shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm font-bold ${
          darkMode 
            ? "bg-gray-700 text-gray-300" 
            : "bg-white text-gray-700"
        }`}>
          {step}
        </div>
      </div>
      <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h3>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</p>
    </div>
  </div>
);

// Benefit Card Component - CORRECT (no changes needed)
const BenefitCard = ({ title, desc, icon: Icon, color, darkMode }) => (
  <div className={`group rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
    darkMode 
      ? "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/90 backdrop-blur-sm border border-cyan-300/10 shadow-black/30 hover:border-cyan-300/25 hover:shadow-cyan-950/40 hover:shadow-2xl"
      : "bg-white hover:shadow-2xl border border-gray-100"
  }`}>
    <div className="flex items-start gap-5">
      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${color} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1">
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h3>
        <p className={`leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { role } = useAuth();
  const consultationPath = role === "doctor" ? "/doctor/dashboard" : "/cases/submit";
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setIsHeroLoaded(true);

    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  return (
    <main className={`w-full overflow-x-hidden transition-colors duration-300 ${
      darkMode ? "bg-[#07111f]" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    }`}>
      
      {/* Hero Section */}
      <section className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${
        darkMode ? "bg-[#07111f]" : "bg-white"
      }`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, ${darkMode ? "0.7" : "0.5"}), rgba(0, 0, 0, ${darkMode ? "0.8" : "0.6"})), url(${doctor4})`,
            transform: `scale(${isHeroLoaded ? 1 : 1.1})`,
            transition: "transform 1.5s ease-out",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        <div className="absolute top-1/4 left-10 animate-float-slow">
          <div className="w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-1/3 right-10 animate-float-fast">
          <div className="w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>

        <div className={`relative z-10 max-w-5xl mx-auto px-4 text-center transform transition-all duration-1000 ${
          isHeroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex m-2 items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">Online dermatology consultations, made simple</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold  text-white leading-tight drop-shadow-2xl">
            Dermaslot
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Expert skin care, from wherever you are
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Start a secure online consultation by sharing photos and details about your skin concern. Connect with a dermatology professional and keep your care plan in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <Link
              to={consultationPath}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Start Your Consultation</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all border border-white/30 hover:border-white/50"
            >
              How It Works
            </Link>
          </div>

          <div className="flex flex-wrap m-2 justify-center gap-4">
            {[
              { icon: ShieldCheck, text: "Secure case details", color: "text-green-400" },
              { icon: Camera, text: "Share photos easily", color: "text-blue-300" },
              { icon: MessageSquare, text: "Online consultation", color: "text-purple-300" },
              { icon: Stethoscope, text: "Dermatology care", color: "text-yellow-300" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <item.icon size={18} className={item.color} />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 relative transition-colors duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#081525] via-[#0a1930] to-[#10122a]" : "bg-white"
      }`}>
        <div className={`absolute inset-0 bg-grid-pattern opacity-5 ${darkMode ? "brightness-50" : ""}`}></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-4 py-2 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Award className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white text-sm font-medium">Our Impact • Real Results</span>
            </div>

            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-gradient ${
              darkMode 
                ? "bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent"
                : "bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent"
            }`}>
              Care that fits
              <br />
              <span className={darkMode ? "text-blue-400" : "text-blue-600"}>into your day</span>
            </h2>

            <p className={`text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Consult online, share what matters, and follow your case from the comfort of home.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter number="3" label="Simple steps" icon={<Stethoscope size={32} />} desc="Share, consult, and follow up online" delay={0} />
            <AnimatedCounter number="1" label="Secure place for your case" icon={<UsersRound size={32} />} desc="Your details, messages, and care notes together" delay={200} />
            <AnimatedCounter number="24" label="Hours to submit" icon={<UserStar size={32} />} desc="Start your case whenever it is convenient for you" delay={400} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#0d1730] via-[#091a2b] to-[#10142c]" : "bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-purple-900/30" : "bg-purple-100"
            }`}>
              <Sparkles className={`w-4 h-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-purple-300" : "text-purple-700"}`}>Designed for online care</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              A better way to begin a consultation
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Give your clinician useful context before you meet, without the hassle of an in-person first visit.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Guided intake"
              desc="Tell us where it is, when it started, what you feel, and what you have already tried."
              icon={Shield}
              gradient="from-blue-500 to-cyan-500"
              darkMode={darkMode}
            />
            <FeatureCard 
              title="Share photos securely"
              desc="Upload clear images to help your clinician understand visible changes."
              icon={BriefcaseMedical}
              gradient="from-green-500 to-emerald-500"
              darkMode={darkMode}
            />
            <FeatureCard 
              title="Stay connected"
              desc="Keep consultation updates, questions, and next steps with your case."
              icon={MessageSquare}
              gradient="from-purple-500 to-pink-500"
              darkMode={darkMode}
            />
            <FeatureCard 
              title="Care that continues"
              desc="Return to your case to review guidance and manage follow-up care."
              icon={Smile}
              gradient="from-orange-500 to-red-500"
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* Common Concerns */}
      <section className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#07111f] via-[#0a1729] to-[#0b1530]" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-blue-900/30" : "bg-blue-100"
            }`}>
              <Droplets className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-700"}`}>Common concerns</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              Common Skin Concerns
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Begin an online consultation for a range of everyday skin concerns.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ConditionCard 
              condition="Eczema & Atopic Dermatitis" 
              icon={Wind} 
              lightColor="bg-gradient-to-br from-amber-50 to-amber-100"
              darkColor="bg-gradient-to-br from-amber-900/30 to-amber-800/20"
              lightBorder="border border-amber-200"
              darkBorder="dark:border border-amber-800"
              lightIcon="text-amber-600"
              darkIcon="dark:text-amber-400"
              darkMode={darkMode}
            />
            <ConditionCard 
              condition="Acne, Breakouts & Folliculitis" 
              icon={Sparkles} 
              lightColor="bg-gradient-to-br from-gray-100 to-gray-200"
              darkColor="bg-gradient-to-br from-gray-800/50 to-gray-700/30"
              lightBorder="border border-gray-200"
              darkBorder="dark:border border-gray-700"
              lightIcon="text-gray-700"
              darkIcon="dark:text-gray-400"
              darkMode={darkMode}
            />
            <ConditionCard 
              condition="Contact Rash & Irritant Dermatitis" 
              icon={Baby} 
              lightColor="bg-gradient-to-br from-pink-50 to-pink-100"
              darkColor="bg-gradient-to-br from-pink-900/30 to-pink-800/20"
              lightBorder="border border-pink-200"
              darkBorder="dark:border border-pink-800"
              lightIcon="text-pink-600"
              darkIcon="dark:text-pink-400"
              darkMode={darkMode}
            />
            <ConditionCard 
              condition="Moles, Birthmarks & New Lesions" 
              icon={Gem} 
              lightColor="bg-gradient-to-br from-purple-50 to-purple-100"
              darkColor="bg-gradient-to-br from-purple-900/30 to-purple-800/20"
              lightBorder="border border-purple-200"
              darkBorder="dark:border border-purple-800"
              lightIcon="text-purple-600"
              darkIcon="dark:text-purple-400"
              darkMode={darkMode}
            />
            <ConditionCard 
              condition="Fungal, Viral & Bacterial Skin Infections" 
              icon={Bug} 
              lightColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
              darkColor="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20"
              lightBorder="border border-yellow-200"
              darkBorder="dark:border border-yellow-800"
              lightIcon="text-yellow-600"
              darkIcon="dark:text-yellow-400"
              darkMode={darkMode}
            />
            <ConditionCard 
              condition="Psoriasis, Vitiligo & Pigment Changes" 
              icon={AlertCircle} 
              lightColor="bg-gradient-to-br from-orange-50 to-orange-100"
              darkColor="bg-gradient-to-br from-orange-900/30 to-orange-800/20"
              lightBorder="border border-orange-200"
              darkBorder="dark:border border-orange-800"
              lightIcon="text-orange-600"
              darkIcon="dark:text-orange-400"
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 relative transition-colors duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#10142c] via-[#0b1e31] to-[#111735]" : "bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30"
      }`}>
        <div className={`absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 ${
          darkMode ? "dark:opacity-5" : ""
        }`}></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-green-900/30" : "bg-green-100"
            }`}>
              <Zap className={`w-4 h-4 ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-green-300" : "text-green-700"}`}>Simple Process</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              How your online consultation works
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>A straightforward way to share your concern and receive guided next steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard step="01" title="Tell us what is happening" desc="Add photos, the affected area, symptoms, and any treatments you have already tried." icon={Camera} gradient="from-blue-500 to-cyan-500" darkMode={darkMode} />
            <StepCard step="02" title="Meet online with your clinician" desc="Your case gives the clinician context for a focused online consultation." icon={Video} gradient="from-purple-500 to-pink-500" darkMode={darkMode} />
            <StepCard step="03" title="Review your next steps" desc="Find your consultation notes, care guidance, and follow-up details in your case record." icon={BriefcaseMedical} gradient="from-green-500 to-emerald-500" darkMode={darkMode} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#07111f] via-[#0b1730] to-[#091a2b]" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-indigo-900/30" : "bg-indigo-100"
            }`}>
              <Heart className={`w-4 h-4 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>Why It Works</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              Online care with the details that matter
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>A more informed conversation starts with a complete picture of your concern.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitCard title="Save time before you meet" desc="Share the key details in advance, so your online consultation can focus on your concern." icon={Clock} color="from-blue-500 to-blue-600" darkMode={darkMode} />
            <BenefitCard title="Make your concern clearer" desc="Photos and symptoms give your clinician a fuller picture of what you are experiencing." icon={Smile} color="from-green-500 to-green-600" darkMode={darkMode} />
            <BenefitCard title="Keep everything together" desc="Your submitted information, consultation notes, and follow-up details stay with your case." icon={ShieldCheck} color="from-purple-500 to-purple-600" darkMode={darkMode} />
            <BenefitCard title="Get guidance for next steps" desc="Use your consultation record to understand the care guidance and follow-up recommended for you." icon={Stethoscope} color="from-orange-500 to-orange-600" darkMode={darkMode} />
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel/>

      {/* FAQs */}
      <section id="faq" className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#11142d] via-[#0b1c30] to-[#10142b]" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      }`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-yellow-900/30" : "bg-yellow-100"
            }`}>
              <MessageSquare className={`w-4 h-4 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>Questions answered</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Helpful information before you start your online consultation.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Who can use Dermaslot?",
                answer: "Dermaslot is designed for people seeking online dermatology guidance. A parent or guardian should submit and manage a case for a child."
              },
              {
                question: "What do I need to start?",
                answer: "You will need clear photos of the concern and a few details, such as when it started, where it appears, symptoms, and treatments you have already tried."
              },
              {
                question: "What conditions can be treated online?",
                answer: "You can start with common concerns such as eczema, rashes, acne, birthmarks, fungal infections, allergies, dermatitis, and changes in skin pigmentation. Your clinician will advise if an in-person visit is more appropriate."
              },
              {
                question: "When will I hear back?",
                answer: "Response times depend on clinician availability and the details of your case. You can check your case record for consultation updates and next steps."
              },
              {
                question: "Is this suitable for urgent or emergency care?",
                answer: "No. If you have severe symptoms, trouble breathing, rapidly spreading swelling or rash, high fever, or any medical emergency, seek immediate in-person medical care or contact local emergency services."
              },
            ].map((faq, index) => (
              <details key={index} className={`group rounded-xl transition-all duration-300 ${
                darkMode 
                  ? "bg-slate-900/80 backdrop-blur-sm border border-cyan-300/10 hover:bg-slate-800/90 hover:border-cyan-300/25"
                  : "bg-white border border-gray-200 hover:shadow-md"
              }`}>
                <summary className={`cursor-pointer p-6 font-semibold text-lg list-none flex items-center justify-between ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  <span>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300 ${
                    darkMode ? "bg-cyan-400/10 border border-cyan-300/15" : "bg-blue-100"
                  }`}>
                    <ArrowRight className={`w-4 h-4 rotate-90 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                </summary>
                <div className={`px-6 pb-6 leading-relaxed border-t pt-4 ${
                  darkMode ? "text-slate-300 border-cyan-300/10" : "text-gray-600 border-gray-200"
                }`}>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 relative overflow-hidden transition-colors duration-300 ${
        darkMode 
          ? "bg-gradient-to-br from-[#111a38] via-[#17154a] to-[#0a3150]"
          : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
      }`}>
        <div className={`absolute inset-0 animate-gradient ${
          darkMode ? "opacity-0" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
        }`}></div>
        {darkMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-indigo-900/30 to-purple-900/30"></div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your online consultation?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Share your concern today and take the next step toward clearer skin care guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to={consultationPath}
              className={`group px-10 py-4 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 ${
                darkMode 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/25" 
                  : "bg-white text-blue-600 hover:shadow-xl"
              }`}
            >
              Start Your Consultation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/doctors"
              className="px-10 py-4 rounded-xl bg-transparent text-white border-2 border-white font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              View Our Doctors
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" />
              <span>Easy online intake</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" />
              <span>Secure case record</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" />
              <span>Care from home</span>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }
          @keyframes scroll {
            0% { transform: translateY(0px); opacity: 1; }
            100% { transform: translateY(10px); opacity: 0; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }
          .animate-float-fast {
            animation: float-fast 4s ease-in-out infinite;
          }
          .animate-scroll {
            animation: scroll 1.5s ease-in-out infinite;
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          .bg-grid-pattern {
            background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
            background-size: 20px 20px;
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
        `}
      </style>
    </main>
  );
};

export default Home;
