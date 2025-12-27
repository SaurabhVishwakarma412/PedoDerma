// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Shield, Video, MessageSquare, Star, ArrowRight ,UsersRound, Stethoscope, UserStar, BriefcaseMedical, Camera} from "lucide-react";
import doctor4 from "../assets/doctor4.jpg";

// Animated Counter Component
const AnimatedCounter = ({ number, label, icon, desc }) => {
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

    let start = 0;
    const end = parseInt(number);
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, number]);

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-5xl font-bold text-blue-900 mb-2">
        {count}
        {number.includes("+") ? "+" : number.includes("%") ? "%" : ""}
      </div>
      <div className="text-xl font-semibold text-gray-800 mb-2">{label}</div>
      <div className="text-gray-600">{desc}</div>
    </div>
  );
};

// Testimonial Carousel Component
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of Emma (6)",
      content: "Amazing experience! Dr. Smith was so patient with Emma and gave us clear instructions. The whole process was smooth.",
      rating: 5,
      avatar: "👩‍👧"
    },
    {
      name: "Michael Chen",
      role: "Parent of Liam (8)",
      content: "Finally found a pediatric dermatologist who understands kids. The video consultation was convenient and thorough.",
      rating: 5,
      avatar: "👨‍👦"
    },
    {
      name: "Priya Patel",
      role: "Parent of Aisha (5)",
      content: "No more long waits at clinics. Quick diagnosis and the prescription worked perfectly. Highly recommended!",
      rating: 5,
      avatar: "👩‍👧‍👧"
    },
    {
      name: "James Wilson",
      role: "Parent of Noah (7)",
      content: "The doctors are wonderful with children. No stress for Noah, and we got the answers we needed immediately.",
      rating: 5,
      avatar: "👨‍👩‍👦"
    },
    {
      name: "Anita Sharma",
      role: "Parent of Zara (4)",
      content: "Best healthcare experience! The team was caring, professional, and solved our concern in just one session.",
      rating: 5,
      avatar: "👩‍👧"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Parents Say About Us
          </h2>
          <p className="text-xl text-blue-200">Real stories from real families</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-1000 ease-out">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full md:w-1/3 flex-shrink-0 px-4"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-lg mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-blue-200 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-400 w-8"
                    : "bg-white/30 hover:bg-white/50"
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
  return (
    <main className="w-full bg-white">
      {/* Hero Section - Enhanced with overlay and better alignment */}
      <section
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${doctor4})` }}
        className="relative text-center py-20 md:py-40 bg-cover bg-center bg-no-repeat overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
            Skip the Travel! Get Pediatric Dermatology Care Online
          </h1>
          <p className="text-lg md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Expert care for your child's skin from board-certified pediatric dermatologists
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/cases/submit"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 group"
            >
              Book Consultation Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              About Tele-Dermatology →
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <CheckCircle size={20} className="text-green-400" />
              <span className="font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-3 text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock size={20} className="text-blue-300" />
              <span className="font-medium">24/7 Access</span>
            </div>
            <div className="flex items-center gap-3 text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Video size={20} className="text-purple-300" />
              <span className="font-medium">Video Consultations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - With Animated Counters */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            Trusted by Thousands of Parents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter number="20" label="Pediatric Dermatologists" icon={<Stethoscope className="mx-auto h-12 w-12 text-blue-500  " />} desc="Board-certified specialists" />
            <AnimatedCounter number="12000" label="Happy Parents" icon={<UsersRound className="mx-auto h-12 w-12  " />} desc="Satisfied families served" />
            <AnimatedCounter number="98" label="Satisfaction Rate" icon= {<UserStar className="mx-auto h-12 w-12 text-yellow-400  " />} desc="Parent satisfaction score" />
          </div>
        </div>
      </section>

      {/* Why Choose Us - Improved layout */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
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
                icon: <Shield className="w-8 h-8 text-blue-600" />
              },
              {
                title: "Digital Prescriptions",
                desc: "Get prescriptions specifically for pediatric medications",
                icon: "📄"
              },
              {
                title: "Free Follow-up",
                desc: "7-day free follow-up for treatment progress",
                icon: <MessageSquare className="w-8 h-8 text-green-600" />
              },
              {
                title: "Child-Friendly Care",
                desc: "Specialized in pediatric skin conditions and treatments",
                icon: "👶"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-4 mx-auto group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Concerns - Enhanced with icons */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
            Common Pediatric Skin Concerns We Treat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { condition: "Eczema & Atopic Dermatitis", icon: "🔴", color: "bg-red-50" },
              { condition: "Acne in Teens", icon: "⚫", color: "bg-gray-50" },
              { condition: "Baby Rashes & Diaper Dermatitis", icon: "👶", color: "bg-pink-50" },
              { condition: "Birthmarks & Moles", icon: "●", color: "bg-purple-50" },
              { condition: "Viral Rashes", icon: "🦠", color: "bg-yellow-50" },
              { condition: "Allergic Reactions", icon: "⚠️", color: "bg-orange-50" },
            ].map((concern, index) => (
              <div key={index} className={`${concern.color} p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{concern.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{concern.condition}</h3>
                    <p className="text-gray-600 text-sm mt-1">Consult a pediatric specialist online</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced visual flow */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              How Pediatric Tele-Dermatology Works
            </h2>
            <p className="text-gray-600 text-lg">Three simple steps to expert care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Photos & Symptoms",
                desc: "Securely upload photos of your child's skin condition and describe symptoms",
                icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl"><Camera className="mx-auto h-12 w-12  " /></div>
              },
              {
                step: "2",
                title: "Consult Pediatric Specialist",
                desc: "Connect with a board-certified pediatric dermatologist via secure video call",
                icon: <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👨‍⚕️</div>
              },
              {
                step: "3",
                title: "Get Diagnosis & Treatment",
                desc: "Receive personalized diagnosis, treatment plan, and digital prescription",
                icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl"><BriefcaseMedical className="mx-auto h-12 w-12  " /></div>
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-8 h-1 bg-blue-200 transform translate-x-full -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Improved layout */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
            Benefits of Pediatric Tele-Dermatology
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Consult Top Pediatric Dermatologists 24x7",
                desc: "Connect instantly with pediatric skin specialists from the comfort of your home",
                icon: "🕒"
              },
              {
                title: "Child-Friendly & Convenient",
                desc: "No travel, no waiting rooms - perfect for children's comfort and schedule",
                icon: "🏠"
              },
              {
                title: "100% Safe & Private Consultations",
                desc: "HIPAA-compliant platform ensuring complete privacy for your child's health data",
                icon: "🔒"
              },
              {
                title: "Specialized Pediatric Care",
                desc: "Doctors experienced in treating children's specific skin conditions and concerns",
                icon: "👨‍⚕️"
              },
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="text-2xl">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* FAQs - Enhanced with accordion-like design */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">Get answers to common questions</p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Is tele-dermatology safe for children?",
                answer: "Yes. Our platform follows strict medical privacy standards (HIPAA-compliant), ensuring your child's medical information and photos remain secure and confidential."
              },
              {
                question: "Can I get a prescription online?",
                answer: "Absolutely. After the dermatologist reviews your case, you receive a digital prescription for pediatric-safe medications that can be purchased at any pharmacy."
              },
              {
                question: "What conditions can be treated online?",
                answer: "Common pediatric skin conditions such as eczema, rashes, acne, birthmarks, fungal infections, allergies, and diaper dermatitis can be diagnosed and treated online."
              },
              {
                question: "How long does it take to receive a diagnosis?",
                answer: "Most cases are reviewed within a few hours. Urgent cases are prioritized and may receive faster responses depending on availability."
              },
              {
                question: "Do I need a prior appointment?",
                answer: "No appointment is required. You can start anytime by uploading photos and details, and a dermatologist will respond as soon as your case is reviewed."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Expert Care for Your Child's Skin?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of parents who trust our pediatric dermatologists
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/cases/submit"
              className="px-10 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Book Consultation
            </Link>
            <Link
              to="/doctors"
              className="px-10 py-4 rounded-xl bg-transparent text-white border-2 border-white font-bold hover:bg-white/10 transition-all"
            >
              Meet Our Doctors →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;