// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
          ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl" 
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
      ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl hover:-translate-y-2" 
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
        ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 hover:shadow-2xl" 
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
      ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 hover:shadow-2xl" 
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
      darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    }`}>
      
      {/* Hero Section */}
      <section className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${
        darkMode ? "bg-gray-900" : "bg-white"
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
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">Expert Dermatological Care — Available 24/7</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-white leading-tight drop-shadow-2xl">
            Skip the Travel!
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Dermatology Online
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Expert care for your skin from board-certified dermatologists
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              to="/cases/submit"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Book Consultation Now</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all border border-white/30 hover:border-white/50"
            >
              Learn More →
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: ShieldCheck, text: "Secure & Private", color: "text-green-400" },
              { icon: Clock, text: "24/7 Access", color: "text-blue-300" },
              { icon: Video, text: "Video Consultations", color: "text-purple-300" },
              { icon: Award, text: "Board Certified", color: "text-yellow-300" }
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
        darkMode ? "bg-gray-900" : "bg-white"
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
              Trusted by Thousands
              <br />
              <span className={darkMode ? "text-blue-400" : "text-blue-600"}>of Happy Parents</span>
            </h2>

            <p className={`text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Making dermatology accessible, affordable, and available for everyone
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter number="20+" label="Dermatologists" icon={<Stethoscope size={32} />} desc="Board-certified specialists" delay={0} />
            <AnimatedCounter number="12000+" label="Happy Patients" icon={<UsersRound size={32} />} desc="Satisfied patients served" delay={200} />
            <AnimatedCounter number="98%" label="Satisfaction Rate" icon={<UserStar size={32} />} desc="Patient satisfaction score" delay={400} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gray-800/50" : "bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-purple-900/30" : "bg-purple-100"
            }`}>
              <Sparkles className={`w-4 h-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-purple-300" : "text-purple-700"}`}>Why Patients Love Us</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              Why Choose Our Dermatology Care
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Specialized care designed specifically for your unique skin needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Verified Pediatric Dermatologists"
              desc="Board-certified specialists in children's skin conditions"
              icon={Shield}
              gradient="from-blue-500 to-cyan-500"
              darkMode={darkMode}
            />
            <FeatureCard 
              title="Digital Prescriptions"
              desc="Get prescriptions specifically for pediatric medications"
              icon={BriefcaseMedical}
              gradient="from-green-500 to-emerald-500"
              darkMode={darkMode}
            />
            <FeatureCard 
              title="Free Follow-up"
              desc="7-day free follow-up for treatment progress"
              icon={MessageSquare}
              gradient="from-purple-500 to-pink-500"
              darkMode={darkMode}
            />
            <FeatureCard 
              title="Patient-Friendly Care"
              desc="Specialized in various skin conditions and treatments"
              icon={Smile}
              gradient="from-orange-500 to-red-500"
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* Common Concerns */}
      <section className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-blue-900/30" : "bg-blue-100"
            }`}>
              <Droplets className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-700"}`}>We Treat</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              Common Skin Concerns
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Expert care for your skin health</p>
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
              condition="Acne in Teens" 
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
              condition="Baby Rashes & Diaper Dermatitis" 
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
              condition="Birthmarks & Moles" 
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
              condition="Viral Rashes" 
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
              condition="Allergic Reactions" 
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
        darkMode ? "bg-gray-800/50" : "bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30"
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
              How Tele-Dermatology Works
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Three simple steps to expert care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard step="01" title="Upload Photos & Symptoms" desc="Securely upload photos of your skin condition and describe symptoms" icon={Camera} gradient="from-blue-500 to-cyan-500" darkMode={darkMode} />
            <StepCard step="02" title="Consult Specialist" desc="Connect with a board-certified dermatologist via secure video call" icon={Video} gradient="from-purple-500 to-pink-500" darkMode={darkMode} />
            <StepCard step="03" title="Get Diagnosis & Treatment" desc="Receive personalized diagnosis, treatment plan, and digital prescription" icon={BriefcaseMedical} gradient="from-green-500 to-emerald-500" darkMode={darkMode} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
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
              Benefits of Tele-Dermatology
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Modern care designed for you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitCard title="Consult Top Dermatologists 24x7" desc="Connect instantly with skin specialists from the comfort of your home" icon={Clock} color="from-blue-500 to-blue-600" darkMode={darkMode} />
            <BenefitCard title="Patient-Friendly & Convenient" desc="No travel, no waiting rooms - perfect for your comfort and schedule" icon={Smile} color="from-green-500 to-green-600" darkMode={darkMode} />
            <BenefitCard title="100% Safe & Private Consultations" desc="HIPAA-compliant platform ensuring complete privacy for your health data" icon={ShieldCheck} color="from-purple-500 to-purple-600" darkMode={darkMode} />
            <BenefitCard title="Specialized Care" desc="Doctors experienced in treating all specific skin conditions and concerns" icon={Stethoscope} color="from-orange-500 to-orange-600" darkMode={darkMode} />
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel/>

      {/* FAQs */}
      <section id="faq" className={`py-20 transition-colors duration-300 ${
        darkMode ? "bg-gray-800/50" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      }`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              darkMode ? "bg-yellow-900/30" : "bg-yellow-100"
            }`}>
              <MessageSquare className={`w-4 h-4 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>Got Questions?</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Everything you need to know</p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Is tele-dermatology safe for children?",
                answer: "Yes. Our platform follows strict medical privacy standards (HIPAA-compliant), ensuring your medical information and photos remain secure and confidential. All our doctors are board-certified dermatologists with years of experience."
              },
              {
                question: "Can I get a prescription online?",
                answer: "Absolutely. After the dermatologist reviews your case, you receive a digital prescription for medications that can be purchased at any pharmacy. We also offer direct pharmacy delivery in select areas."
              },
              {
                question: "What conditions can be treated online?",
                answer: "Common skin conditions such as eczema, rashes, acne, birthmarks, fungal infections, allergies, and dermatitis can be diagnosed and treated online. For emergency cases, we'll guide you to the nearest care facility."
              },
              {
                question: "How long does it take to receive a diagnosis?",
                answer: "Most cases are reviewed within a few hours. Urgent cases are prioritized and may receive faster responses depending on availability. Our average response time is under 2 hours during business hours."
              },
              {
                question: "Do I need a prior appointment?",
                answer: "No appointment is required. You can start anytime by uploading photos and details, and a dermatologist will respond as soon as your case is reviewed. We offer both immediate and scheduled consultations."
              },
            ].map((faq, index) => (
              <details key={index} className={`group rounded-xl transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800" 
                  : "bg-white border border-gray-200 hover:shadow-md"
              }`}>
                <summary className={`cursor-pointer p-6 font-semibold text-lg list-none flex items-center justify-between ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  <span>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300 ${
                    darkMode ? "bg-blue-900/50" : "bg-blue-100"
                  }`}>
                    <ArrowRight className={`w-4 h-4 rotate-90 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                </summary>
                <div className={`px-6 pb-6 leading-relaxed border-t pt-4 ${
                  darkMode ? "text-gray-400 border-gray-700" : "text-gray-600 border-gray-200"
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
          ? "bg-gradient-to-br from-gray-800 to-gray-900" 
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
            Ready to Get Expert Care for Your Skin?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust our dermatologists
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/cases/submit"
              className={`group px-10 py-4 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 ${
                darkMode 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/25" 
                  : "bg-white text-blue-600 hover:shadow-xl"
              }`}
            >
              Book Consultation Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/doctors"
              className="px-10 py-4 rounded-xl bg-transparent text-white border-2 border-white font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              Meet Our Doctors
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" />
              <span>Money-Back Guarantee</span>
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
