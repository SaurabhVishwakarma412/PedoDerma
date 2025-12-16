// frontend/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Shield, Video, MessageSquare, Star } from "lucide-react";
import doctor4 from "../assets/doctor4.jpg";
import doctor6 from "../assets/doctor6.jpg";
import camera2 from "../assets/camera2.avif";

const Home = () => {
  return (
    <main className="w-full">
      {/* Hero Section - Enhanced with overlay and better alignment */}
      <section
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${doctor4})` }}
        className="relative text-center py-20 md:py-32 bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Skip the Travel! Get Pediatric Dermatology Care Online
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Expert care for your child's skin from board-certified pediatric dermatologists
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/book-online"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Book Consultation Now
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-50 transition-all shadow-lg"
            >
              How It Works →
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle size={20} className="text-green-400" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Clock size={20} className="text-blue-300" />
              <span>24/7 Access</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Video size={20} className="text-purple-300" />
              <span>Video Consultations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced with cards */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            Trusted by Thousands of Parents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "50+", label: "Pediatric Dermatologists", icon: "👨‍⚕️", desc: "Board-certified specialists" },
              { number: "10,000+", label: "Happy Parents", icon: "😊", desc: "Satisfied families served" },
              { number: "98%", label: "Satisfaction Rate", icon: "⭐", desc: "Parent satisfaction score" },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-blue-900 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Improved layout */}
      <section className="py-16 bg-gray-50">
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
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-4 mx-auto">
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
                icon: <img className="w-16 h-16 rounded-full object-cover" src={camera2} alt="Camera" />
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
                icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">💊</div>
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

      {/* Testimonial/Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Happy Parents", sublabel: "Families served" },
              { number: "50+", label: "Verified Doctors", sublabel: "Pediatric specialists" },
              { number: "98%", label: "Satisfaction", sublabel: "Parent rating" },
              { number: "4.8/5", label: "Platform Rating", sublabel: "User reviews" },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-blue-200">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs - Enhanced with accordion-like design */}
      <section className="py-16 bg-gray-50">
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
              to="/book-online"
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