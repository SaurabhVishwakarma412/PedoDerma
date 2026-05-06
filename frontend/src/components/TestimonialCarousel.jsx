// Testimonial Carousel Component with enhanced design
import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, Star, UsersRound } from 'lucide-react';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Parent of Priti (6)",
      content: "Amazing experience! Dr. Smith was so patient with Priti and gave us clear instructions. The whole process was smooth and stress-free.",
      rating: 5,
      avatar: "👩‍👧",
      location: "Ranchi, Jharkhand"
    },
    {
      name: "Abhishek Verma",
      role: "Parent of Shyam (8)",
      content: "Finally found a pediatric dermatologist who understands kids. The video consultation was convenient and thorough. Highly recommended!",
      rating: 5,
      avatar: "👨",
      location: "Patna, Bihar"
    },
    {
      name: "Priya Patel",
      role: "Parent of Aisha (5)",
      content: "No more long waits at clinics. Quick diagnosis and the prescription worked perfectly. The follow-up care was exceptional!",
      rating: 5,
      avatar: "👩‍👧",
      location: "Hamirpur, Himachal Pradesh"
    },
    {
      name: "Rahul Singh",
      role: "Parent of Neha (7)",
      content: "The doctors are wonderful with children. No stress for Neha, and we got the answers we needed immediately. Life-changing service!",
      rating: 5,
      avatar: "👨‍👩",
      location: "Bhopal, Madhya Pradesh"
    },
    {
      name: "Anita Sharma",
      role: "Parent of Zara (4)",
      content: "Best healthcare experience! The team was caring, professional, and solved our concern in just one session. Truly exceptional.",
      rating: 5,
      avatar: "👩‍👧",
      location: "Indore, Madhya Pradesh"
    },
    {
      name: "Suman Tirkey",
      role: "Parent of Arjun (4)",
      content: "Best healthcare experience! The team was caring, professional, and solved our concern in just one session. Truly exceptional.",
      rating: 5,
      avatar: "👩‍👧",
      location: "Indore, Madhya Pradesh"
    }
  ];

  useEffect(() => {
    const themeObserver = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));
    
    return () => themeObserver.disconnect();
  }, []); // Removed testimonials.length from dependencies

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
    <section className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 mb-6 ${
            darkMode ? "bg-white/10" : "bg-white/80 shadow-sm"
          }`}>
            <Heart className={`w-5 h-5 ${darkMode ? "text-pink-400" : "text-pink-500"}`} />
            <span className={`text-sm font-medium ${darkMode ? "text-white/90" : "text-gray-700"}`}>Real Stories</span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            What Parents Say About Us
          </h2>
          <p className={`text-xl ${darkMode ? "text-blue-200" : "text-blue-600"}`}>Trusted by families across the country</p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 backdrop-blur-sm rounded-full p-3 transition-all duration-300 ${
              darkMode 
                ? "bg-white/20 hover:bg-white/40" 
                : "bg-white shadow-lg hover:shadow-xl hover:bg-gray-50"
            }`}
            aria-label="Previous testimonial"
          >
            <ArrowRight className={`w-6 h-6 ${darkMode ? "text-white" : "text-gray-700"} rotate-180`} />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 backdrop-blur-sm rounded-full p-3 transition-all duration-300 ${
              darkMode 
                ? "bg-white/20 hover:bg-white/40" 
                : "bg-white shadow-lg hover:shadow-xl hover:bg-gray-50"
            }`}
            aria-label="Next testimonial"
          >
            <ArrowRight className={`w-6 h-6 ${darkMode ? "text-white" : "text-gray-700"}`} />
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
                  <div className={`backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl transition-all duration-300 ${
                    darkMode 
                      ? "bg-white/10 border border-white/20" 
                      : "bg-white border border-gray-100"
                  }`}>
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className={`text-lg md:text-xl mb-8 italic leading-relaxed ${darkMode ? "text-white" : "text-gray-700"}`}>
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl rounded-full w-16 h-16 flex items-center justify-center ${
                        darkMode ? "bg-white/20" : "bg-gray-100"
                      }`}>
                        <UsersRound className="w-8 h-8" />
                      </div>
                      <div>
                        <p className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>{testimonial.name}</p>
                        <p className={`text-sm ${darkMode ? "text-blue-200" : "text-blue-600"}`}>{testimonial.role}</p>
                        <p className={`text-xs mt-1 ${darkMode ? "text-blue-300" : "text-gray-500"}`}>{testimonial.location}</p>
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
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? darkMode ? "bg-blue-400 w-8 h-2" : "bg-blue-500 w-8 h-2"
                    : darkMode ? "bg-white/30 hover:bg-white/50 w-2 h-2" : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;