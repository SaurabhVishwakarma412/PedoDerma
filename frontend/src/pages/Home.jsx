// frontend/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import doctor4 from "../assets/doctor4.jpg";
import doctor6 from "../assets/doctor6.jpg";
import camera2 from "../assets/camera2.avif";

const Home = () => {
  return (
    <main className="w-full min-h-96 mx-auto">
      {/* Hero Section */}
      <section style={{ backgroundImage: `url(${doctor4})` }} className="text-center mb-12 py-8 bg-cover min-h-96 bg-center">
        <div className="max-w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">
            Skip the travel! Take Online Pediatric Dermatology Consultation
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Private consultation + Secure photo upload · Expert care for your child's skin
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Consult Now
            </Link>
            <Link
              to="/doctor/login"
              className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
            >
              Doctor Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Doctor Stats Section */}
      <section className="my-16 bg-gray-200 p-8 rounded-xl text-center lg:mx-20">
        <div className="flex flex-wrap  justify-center gap-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full flex items-center justify-center">
              <img className="rounded-full h-12 w-12" src={doctor6} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">50+</p>
              <p className="text-gray-600">Pediatric Dermatologists</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              ✅
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">Verified</p>
              <p className="text-gray-600">Board-Certified Doctors</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              📱
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">4.8/5</p>
              <p className="text-gray-600">Parent Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="m-2 lg:mx-20 md:mx-8 mb-16">
        <h1 className="text-3xl font-bold mb-6 text-blue-900 ">Why Choose Our Pediatric Dermatology Care</h1>
        <div className="grid md:grid-cols-4 gap-6 " >
          <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-blue-900">Verified Pediatric Dermatologists</h3>
            <p className="text-gray-600 text-sm">Board-certified specialists in children's skin conditions</p>
          </div>
          <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-blue-900">Digital Prescription</h3>
            <p className="text-gray-600 text-sm">Get prescriptions specifically for pediatric medications</p>
          </div>
          <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-blue-900">Free Follow-up</h3>
            <p className="text-gray-600 text-sm">7-day free follow-up for treatment progress</p>
          </div>
          <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-blue-900">Child-Friendly</h3>
            <p className="text-gray-600 text-sm">Specialized in pediatric skin conditions and treatments</p>
          </div>
        </div>
      </section>

      {/* Common Pediatric Skin Concerns */}
      <section className="mb-16 m-2 lg:mx-20 md:mx-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">
          Common Pediatric Skin Concerns
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['Eczema & Atopic Dermatitis', 'Acne in Teens', 'Baby Rashes & Diaper Dermatitis',
            'Birthmarks & Moles', 'Viral Rashes', 'Allergic Reactions'].map((concern, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-blue-400 transition">
                <h3 className="font-medium text-gray-800">{concern}</h3>
                <p className="text-sm text-gray-600 mt-1">Consult a pediatric dermatologist online</p>
              </div>
            ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 m-2 lg:mx-20 md:mx-8 bg-blue-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
          How Pediatric Tele-Dermatology Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow">
              <img className="rounded-full h-full " src={camera2} alt="camera" />
            </div>
            <h3 className="font-semibold mb-2">Upload Photos & Symptoms</h3>
            <p className="text-gray-600 text-sm">Securely upload photos of your child's skin condition and describe symptoms</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h3 className="font-semibold mb-2">Consult Pediatric Specialist</h3>
            <p className="text-gray-600 text-sm">Connect with a board-certified pediatric dermatologist via secure chat or call</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
              <span className="text-2xl">💊</span>
            </div>
            <h3 className="font-semibold mb-2">Get Diagnosis & Prescription</h3>
            <p className="text-gray-600 text-sm">Receive diagnosis, pediatric-appropriate treatment plan and digital prescription</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className=" m-2 lg:mx-20 md:mx-8 mb-16 ">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">
          Benefits of Pediatric Tele-Dermatology
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Consult Top Pediatric Dermatologists 24x7</h3>
            <p className="text-gray-600">Connect instantly with pediatric skin specialists from the comfort of your home</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Child-Friendly & Convenient</h3>
            <p className="text-gray-600">No travel, no waiting rooms - perfect for children's comfort and schedule</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">100% Safe & Private Consultations</h3>
            <p className="text-gray-600">HIPAA-compliant platform ensuring complete privacy for your child's health data</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Specialized Pediatric Care</h3>
            <p className="text-gray-600">Doctors experienced in treating children's specific skin conditions and concerns</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 bg-gray-200 rounded-xl p-8 m-2 lg:mx-20 md:mx-8 ">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-900 mb-2">10,000+</p>
            <p className="text-gray-600">Happy Parents</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900 mb-2">50+</p>
            <p className="text-gray-600">Verified Pediatric Dermatologists</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900 mb-2">98%</p>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900 mb-2">4.8/5</p>
            <p className="text-gray-600">Platform Rating</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="m-2 lg:mx-20 md:mx-8 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Is tele-dermatology safe for children?</h3>
            <p className="text-gray-600 text-sm">
              Yes. Our platform follows strict medical privacy standards, ensuring your child's medical information and photos remain secure and confidential.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Can I get a prescription online?</h3>
            <p className="text-gray-600 text-sm">
              Absolutely. After the dermatologist reviews your case, you receive a digital prescription for pediatric-safe medications that can be purchased at any pharmacy.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">What conditions can be treated online?</h3>
            <p className="text-gray-600 text-sm">
              Common pediatric skin conditions such as eczema, rashes, acne, birthmarks, fungal infections, allergies, and diaper dermatitis can be diagnosed and treated online.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">How long does it take to receive a diagnosis?</h3>
            <p className="text-gray-600 text-sm">
              Most cases are reviewed within a few hours. Urgent cases are prioritized and may receive faster responses depending on availability.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Do I need a prior appointment?</h3>
            <p className="text-gray-600 text-sm">
              No appointment is required. You can start anytime by uploading photos and details, and a dermatologist will respond as soon as your case is reviewed.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Is follow-up included in the consultation?</h3>
            <p className="text-gray-600 text-sm">
              Yes. We offer a 7-day free follow-up to track your child’s progress and adjust treatment if needed, without any additional cost.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center mb-12 py-8 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">
          Experience Pediatric Dermatology Care from Home
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Get expert care for your child's skin without leaving home. Connect with pediatric dermatologists who understand children's unique skin needs.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Start Consultation
          <span className="ml-2">→</span>
        </Link>
      </section>
    </main>
  );
};

export default Home;