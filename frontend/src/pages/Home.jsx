// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle, Clock, Shield, Video, MessageSquare, Star, ArrowRight,
  UsersRound, Stethoscope, UserStar, BriefcaseMedical, Camera,
  Sparkles, Heart, Award, Zap, ShieldCheck, Calendar, Smile,
  Droplets,Wind,Baby, Gem, Bug, AlertCircle,
} from "lucide-react";

import doctor4 from "../assets/doctor4.jpg";

// Animated Counter Component with enhanced styling
const AnimatedCounter = ({ number, label, icon, desc, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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

    return () => observer.disconnect();
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
      className="group relative bg-blue-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <div className="text-white text-3xl">{icon}</div>
        </div>
        <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          {count}
          {number.includes("+") ? "+" : number.includes("%") ? "%" : ""}
        </div>
        <div className="text-xl font-bold text-gray-800 mb-2">{label}</div>
        <div className="text-gray-500 text-sm">{desc}</div>
      </div>
    </div>
  );
};

// Testimonial Carousel Component with enhanced design
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of Emma (6)",
      content: "Amazing experience! Dr. Smith was so patient with Emma and gave us clear instructions. The whole process was smooth and stress-free.",
      rating: 5,
      avatar: "👩‍👧",
      location: "New York, NY"
    },
    {
      name: "Michael Chen",
      role: "Parent of Liam (8)",
      content: "Finally found a pediatric dermatologist who understands kids. The video consultation was convenient and thorough. Highly recommended!",
      rating: 5,
      avatar: "👨‍👦",
      location: "San Francisco, CA"
    },
    {
      name: "Priya Patel",
      role: "Parent of Aisha (5)",
      content: "No more long waits at clinics. Quick diagnosis and the prescription worked perfectly. The follow-up care was exceptional!",
      rating: 5,
      avatar: "👩‍👧‍👧",
      location: "Austin, TX"
    },
    {
      name: "James Wilson",
      role: "Parent of Noah (7)",
      content: "The doctors are wonderful with children. No stress for Noah, and we got the answers we needed immediately. Life-changing service!",
      rating: 5,
      avatar: "👨‍👩‍👦",
      location: "Chicago, IL"
    },
    {
      name: "Anita Sharma",
      role: "Parent of Zara (4)",
      content: "Best healthcare experience! The team was caring, professional, and solved our concern in just one session. Truly exceptional.",
      rating: 5,
      avatar: "👩‍👧",
      location: "Seattle, WA"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-white/90 text-sm font-medium">Real Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Parents Say About Us
          </h2>
          <p className="text-xl text-blue-200">Trusted by families across the country</p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full p-3 transition-all duration-300"
          >
            <ArrowRight className="w-6 h-6 text-white rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full p-3 transition-all duration-300"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>

          <div className="overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-out ${isAnimating ? 'transition-all' : ''}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4 md:px-8"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/20 shadow-2xl">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white text-lg md:text-xl mb-8 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{testimonial.name}</p>
                        <p className="text-blue-200 text-sm">{testimonial.role}</p>
                        <p className="text-blue-300 text-xs mt-1">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                  ? "bg-blue-400 w-8 h-2"
                  : "bg-white/30 hover:bg-white/50 w-2 h-2"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for theme toggle

  useEffect(() => {
    setIsHeroLoaded(true);

    // Listen for theme changes from the document's class
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <main
      className={`w-full overflow-x-hidden ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
    >
      {/* Hero Section - Enhanced with parallax effect */}
      <section
        className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, ${darkMode ? "0.6" : "0.4"}), rgba(0, 0, 0, ${darkMode ? "0.7" : "0.5"})), url(${doctor4})`,
            transform: `scale(${isHeroLoaded ? 1 : 1.1})`,
            transition: "transform 1.5s ease-out",
          }}
        />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 animate-float-slow">
          <div className="w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-1/3 right-10 animate-float-fast">
          <div className="w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>

        <div className={`relative z-10 max-w-5xl mx-auto px-4 text-center transform transition-all duration-1000 ${isHeroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">Expert Pediatric Care — Available 24/7</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl  font-bold mb-4 text-white leading-tight drop-shadow-2xl">
            Skip the Travel!
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Pediatric Dermatology Online
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Expert care for your child's skin from board-certified pediatric dermatologists
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

      {/* Stats Section - Enhanced with glassmorphism */}
      <section
        className={`py-20 relative ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-4 py-2 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Award className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white text-sm font-medium">Our Impact • Real Results</span>
            </div>

            {/* Animated heading with gradient text */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent animate-gradient">
              Trusted by Thousands
              <br />
              <span className="text-blue-600">of Happy Parents</span>
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              Making pediatric dermatology accessible, affordable, and available for everyone
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter number="20+" label="Pediatric Dermatologists" icon={<Stethoscope size={32} />} desc="Board-certified specialists" delay={0} />
            <AnimatedCounter number="12000+" label="Happy Parents" icon={<UsersRound size={32} />} desc="Satisfied families served" delay={200} />
            <AnimatedCounter number="98%" label="Satisfaction Rate" icon={<UserStar size={32} />} desc="Parent satisfaction score" delay={400} />
          </div>
        </div>
      </section>
  

      {/* Why Choose Us - Enhanced with hover effects */}
      <section
        className={`py-20 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">Why Families Love Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Why Choose Our Pediatric Dermatology Care
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Specialized care designed specifically for children's unique skin needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Verified Pediatric Dermatologists",
                desc: "Board-certified specialists in children's skin conditions",
                icon: Shield,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Digital Prescriptions",
                desc: "Get prescriptions specifically for pediatric medications",
                icon: BriefcaseMedical,
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "Free Follow-up",
                desc: "7-day free follow-up for treatment progress",
                icon: MessageSquare,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Child-Friendly Care",
                desc: "Specialized in pediatric skin conditions and treatments",
                icon: Smile,
                gradient: "from-orange-500 to-red-500"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Concerns - Enhanced with icons and animations */}
      <section
        className={`py-20 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 to-blue-50/30"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">We Treat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Common Pediatric Skin Concerns
            </h2>
            <p className="text-gray-600 text-lg">Expert care for your child's skin health</p>
          </div>

          {/* Conditions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { condition: "Eczema & Atopic Dermatitis", icon: Wind, color: "from-amber-50 to-amber-50", border: "border-amber-200", iconColor: "text-amber-600" },
              { condition: "Acne in Teens", icon: Sparkles, color: "from-gray-100 to-gray-100", border: "border-gray-200", iconColor: "text-gray-700" },
              { condition: "Baby Rashes & Diaper Dermatitis", icon: Baby, color: "from-pink-50 to-pink-50", border: "border-pink-200", iconColor: "text-pink-600" },
              { condition: "Birthmarks & Moles", icon: Gem, color: "from-purple-50 to-purple-50", border: "border-purple-200", iconColor: "text-purple-600" },
              { condition: "Viral Rashes", icon: Bug, color: "from-yellow-50 to-yellow-50", border: "border-yellow-200", iconColor: "text-yellow-600" },
              { condition: "Allergic Reactions", icon: AlertCircle, color: "from-orange-50 to-orange-50", border: "border-orange-200", iconColor: "text-orange-600" },
            ].map((concern, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br ${concern.color} p-6 rounded-2xl border ${concern.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <concern.icon className={`w-6 h-6 ${concern.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{concern.condition}</h3>
                    <p className="text-gray-500 text-sm mt-1">Consult a specialist online</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced with step indicators */}
      <section
        className={`py-20 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              How Pediatric Tele-Dermatology Works
            </h2>
            <p className="text-gray-600 text-lg">Three simple steps to expert care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Photos & Symptoms",
                desc: "Securely upload photos of your child's skin condition and describe symptoms",
                icon: Camera,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                step: "02",
                title: "Consult Pediatric Specialist",
                desc: "Connect with a board-certified pediatric dermatologist via secure video call",
                icon: Video,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Get Diagnosis & Treatment",
                desc: "Receive personalized diagnosis, treatment plan, and digital prescription",
                icon: BriefcaseMedical,
                gradient: "from-green-500 to-emerald-500"
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-200 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-full blur-xl opacity-30`}></div>
                    <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-sm font-bold text-gray-700">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Enhanced with cards */}
      <section
        className={`py-20 ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gradient-to-br from-indigo-50 to-blue-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700 text-sm font-medium">Why It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Benefits of Pediatric Tele-Dermatology
            </h2>
            <p className="text-gray-600 text-lg">Modern care designed for modern families</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Consult Top Pediatric Dermatologists 24x7",
                desc: "Connect instantly with pediatric skin specialists from the comfort of your home",
                icon: Clock,
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Child-Friendly & Convenient",
                desc: "No travel, no waiting rooms - perfect for children's comfort and schedule",
                icon: Smile,
                color: "from-green-500 to-green-600"
              },
              {
                title: "100% Safe & Private Consultations",
                desc: "HIPAA-compliant platform ensuring complete privacy for your child's health data",
                icon: ShieldCheck,
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Specialized Pediatric Care",
                desc: "Doctors experienced in treating children's specific skin conditions and concerns",
                icon: Stethoscope,
                color: "from-orange-500 to-orange-600"
              },
            ].map((benefit, index) => (
              <div key={index} className="group bg-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${benefit.color} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* FAQs - Enhanced with interactive design */}
      <section
        id="faq"
        className={`py-20 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2 mb-4">
              <MessageSquare className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-700 text-sm font-medium">Got Questions?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-500 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to know</p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Is tele-dermatology safe for children?",
                answer: "Yes. Our platform follows strict medical privacy standards (HIPAA-compliant), ensuring your child's medical information and photos remain secure and confidential. All our doctors are board-certified pediatric dermatologists with years of experience."
              },
              {
                question: "Can I get a prescription online?",
                answer: "Absolutely. After the dermatologist reviews your case, you receive a digital prescription for pediatric-safe medications that can be purchased at any pharmacy. We also offer direct pharmacy delivery in select areas."
              },
              {
                question: "What conditions can be treated online?",
                answer: "Common pediatric skin conditions such as eczema, rashes, acne, birthmarks, fungal infections, allergies, and diaper dermatitis can be diagnosed and treated online. For emergency cases, we'll guide you to the nearest care facility."
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
              <details key={index} className="group bg-gray-300 rounded-xl hover:bg-gray-200 transition-all duration-300">
                <summary className="cursor-pointer p-6 font-semibold text-gray-800 text-lg list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 text-blue-600 rotate-90" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-400 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced with gradient animation */}
      <section
        className={`py-20 relative overflow-hidden ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] [background-size:24px_24px] opacity-10"></div>        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Expert Care for Your Child's Skin?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who trust our pediatric dermatologists
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/cases/submit"
              className="group px-10 py-4 rounded-xl bg-white text-blue-600 font-bold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
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

      {/* Add style tag for animations */}
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
        `}
      </style>
    </main>
  );
};

export default Home;