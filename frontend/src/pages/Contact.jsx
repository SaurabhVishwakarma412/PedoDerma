// frontend/src/pages/Contact.jsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from "lucide-react";
import Input from "../components/Input";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "parent"
  });

  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Define the contactSubjects array
  const contactSubjects = [
    "General Inquiry",
    "Technical Support",
    "Billing Questions",
    "Doctor Registration",
    "Medical Questions",
    "Feedback/Suggestions",
    "Emergency Support"
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          userType: "parent"
        });
      }, 2000);
    }, 1500);
  };

  return (
    <main className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50"} py-12`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">
            Contact Our Pediatric Dermatology Team
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Have questions about your child's skin care? Our team is here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Emergency Support</h4>
                    <p className="text-blue-600 font-semibold text-lg">100</p>
                    <p className="text-sm text-gray-500">Available 24/7 for urgent cases</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email Us</h4>
                    <a href="mailto:support@pediatricderm.com" className="text-blue-600 hover:underline">
                      support@pediatricderm.com
                    </a>
                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Live Chat</h4>
                    <p className="text-blue-600 font-semibold">Available on website</p>
                    <p className="text-sm text-gray-500">Quick answers to common questions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Support Hours
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 8:00 PM EST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Saturday - Sunday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM EST</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Emergency support available 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                Before You Contact
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>For medical consultations, please use our booking system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Have your case ID ready for faster service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Upload photos of the condition if applicable</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl shadow-lg p-8 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}`}>
              {/* Success Message */}
              {sent && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300">Message Sent Successfully!</h4>
                      <p className="text-green-700 dark:text-green-400 text-sm">
                        Thank you for reaching out. Our team will respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    darkMode={darkMode}
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="91-XXXXX XXXXX"
                    darkMode={darkMode}
                  />

                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    darkMode={darkMode}
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                    >
                      <option value="">Select a subject</option>
                      {contactSubjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                      placeholder={
                        form.userType === "parent"
                          ? "Describe your child's condition or question in detail. Please include child's age and any relevant medical history..."
                          : "Please provide details about your inquiry..."
                      }
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all ${isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'
                      } text-white shadow-lg`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    By submitting, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Answers
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: "How quickly will I receive a response?",
                    a: "We respond to all inquiries within 24 hours during business days. Emergency contacts are monitored 24/7."
                  },
                  {
                    q: "Can I get medical advice through this form?",
                    a: "For specific medical consultations, please book an appointment through our system for proper documentation and care."
                  },
                  {
                    q: "Are my child's medical details secure?",
                    a: "Yes, all communications are encrypted and HIPAA-compliant to ensure complete privacy and security."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white/50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{faq.q}</p>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map/Location Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Our Headquarters
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                <p className="text-gray-600">
                  LPU<br />
                  Phagwara<br />
                  Punjab, India
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Business Inquiries</h4>
                <a href="mailto:partners@pediatricderm.com" className="text-blue-600 hover:underline">
                  partners@pediatricderm.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Office Phone</h4>
                <p className="text-gray-600">91- XXXXX XXXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;