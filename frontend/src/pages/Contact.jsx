// frontend/src/pages/Contact.jsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, HelpCircle, Building2, Globe } from "lucide-react";
import Input from "../components/Input";
import emailjs from '@emailjs/browser';

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
    setDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  const contactSubjects = [
    "General Inquiry",
    "Technical Support",
    "Billing Questions",
    "Doctor Registration",
    "Medical Questions",
    "Feedback/Suggestions",
    "Emergency Support",
    "Complaint"
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // EmailJS parameters - Make sure to replace these with your actual credentials
    const emailParams = {
      to_email: "saurabhkv412@gmail.com", // Replace with your email where you want to receive complaints
      from_name: form.name,
      from_email: form.email,
      phone: form.phone || "Not provided",
      subject: `[${form.subject}] - ${form.name}`,
      message: form.message,
      user_type: form.userType,
      reply_to: form.email
    };

    try {
      // Initialize EmailJS with your public key
      emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual EmailJS public key
      
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        emailParams
      );

      if (result.status === 200) {
        setSent(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          userType: "parent"
        });
        setTimeout(() => setSent(false), 5000);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try again later or contact us directly at pedoderma@gmail.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact Card Component
  const ContactCard = ({ icon: Icon, title, content, subtext, href, color }) => (
    <div className={`group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${darkMode
      ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl"
      : "bg-white shadow-lg hover:shadow-xl border border-gray-100"
      }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-lg mb-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h4>
          {href ? (
            <a href={href} className={`font-semibold text-lg transition ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
              {content}
            </a>
          ) : (
            <p className={`font-semibold text-lg ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{content}</p>
          )}
          <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{subtext}</p>
        </div>
      </div>
    </div>
  );

  // FAQ Item Component
  const FAQItem = ({ question, answer }) => (
    <div className={`p-4 rounded-lg transition-all duration-300 ${darkMode
      ? "bg-gray-800/50 border border-gray-700 hover:bg-gray-800"
      : "bg-white/80 border border-gray-100 hover:shadow-md"
      }`}>
      <p className={`font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{question}</p>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{answer}</p>
    </div>
  );

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      } py-4`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 ${darkMode ? "bg-blue-900/30" : "bg-blue-100"
            }`}>
            <MessageSquare className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-700"}`}>24/7 Support Available</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"
            }`}>
            Contact Our{" "}
            <span className={`bg-gradient-to-r ${darkMode ? "from-blue-400 to-indigo-400" : "from-blue-600 to-indigo-600"} bg-clip-text text-transparent`}>
              Pediatric Dermatology Team
            </span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Have questions about your child's skin care? Our team is here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column - Contact Information */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${darkMode
              ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
              : "bg-white border border-gray-100"
              }`}>
              {/* Success Message */}
              {sent && (
                <div className={`mb-6 p-4 rounded-lg border ${darkMode
                  ? "bg-green-900/20 border-green-800"
                  : "bg-green-50 border-green-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    <div>
                      <h4 className={`font-semibold ${darkMode ? "text-green-400" : "text-green-800"}`}>Message Sent Successfully!</h4>
                      <p className={`text-sm ${darkMode ? "text-green-300" : "text-green-700"}`}>
                        Thank you for reaching out. Our team will respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* User Type Selection */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      I am a *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="userType"
                          value="parent"
                          checked={form.userType === "parent"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>Parent/Guardian</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="userType"
                          value="doctor"
                          checked={form.userType === "doctor"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>Medical Professional</span>
                      </label>
                    </div>
                  </div>

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
                    placeholder="+91 XXXXX XXXXX"
                    darkMode={darkMode}
                  />

                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your-email@gmail.com"
                    darkMode={darkMode}
                  />

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-50 border border-gray-300"
                        }`}
                    >
                      <option value="">Select a subject</option>
                      {contactSubjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y ${darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-50 border border-gray-300"
                        }`}
                      placeholder={
                        form.userType === "parent"
                          ? "Describe your child's condition or question in detail..."
                          : "Please provide details about your inquiry..."
                      }
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 w-full md:w-auto ${isSubmitting
                      ? darkMode ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105'
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
                  <p className={`text-sm mt-3 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                    By submitting, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className={`mt-8 rounded-xl p-6 transition-colors duration-300 ${darkMode
              ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/50"
              : "bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className={`w-6 h-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Quick Answers
                </h3>
              </div>
              <div className="space-y-4">
                <FAQItem
                  question="How quickly will I receive a response?"
                  answer="We respond to all inquiries within 24 hours during business days. Emergency contacts are monitored 24/7."
                />
                <FAQItem
                  question="Can I get medical advice through this form?"
                  answer="For specific medical consultations, please book an appointment through our system for proper documentation and care."
                />
                <FAQItem
                  question="Are my child's medical details secure?"
                  answer="Yes, all communications are encrypted and HIPAA-compliant to ensure complete privacy and security."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${darkMode
              ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
              : "bg-white border border-gray-100"
              }`}>
              <h3 className={`text-xl font-semibold mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                Get in Touch
              </h3>

              <div className="space-y-4">
                <ContactCard
                  icon={Phone}
                  title="Emergency Support"
                  content="108"
                  subtext="Available 24/7 for urgent cases"
                  color="from-red-500 to-pink-500"
                />

                <ContactCard
                  icon={Mail}
                  title="Email Us"
                  content="pedoderma@gmail.com"
                  subtext="Response within 24 hours"
                  href="mailto:pedoderma@gmail.com"
                  color="from-blue-500 to-cyan-500"
                />

                <ContactCard
                  icon={MessageSquare}
                  title="Live Chat"
                  content="Available on website"
                  subtext="Quick answers to common questions"
                  color="from-green-500 to-emerald-500"
                />
              </div>
            </div>

            {/* Office Hours */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${darkMode
              ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
              : "bg-white border border-gray-100"
              }`}>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                Support Hours
              </h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}>
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Monday - Friday</span>
                  <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>9:00 AM - 8:00 PM EST</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}>
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Saturday - Sunday</span>
                  <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>10:00 AM - 6:00 PM EST</span>
                </div>
                <div className="pt-4 border-t dark:border-gray-700">
                  <div className={`flex items-center gap-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Emergency support available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map/Location Section */}
        <div className={`mt-12 rounded-xl shadow-lg p-8 transition-colors duration-300 ${darkMode
          ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
          : "bg-white border border-gray-100"
          }`}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${darkMode ? "bg-blue-900/30" : "bg-blue-100"
              }`}>
              <Building2 className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-700"}`}>Visit Us</span>
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Our Headquarters
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Address",
                content: "LPU, Phagwara\nPunjab, India",
                color: "from-red-500 to-orange-500"
              },
              {
                icon: Mail,
                title: "Business Inquiries",
                content: "pedoderma@gmail.com",
                link: "mailto:pedoderma@gmail.com",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Phone,
                title: "Office Phone",
                content: "+91 XXXXX XXXXX",
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <div key={index} className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 ${darkMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{item.title}</h4>
                  {item.link ? (
                    <a href={item.link} className={`transition ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
                      {item.content}
                    </a>
                  ) : (
                    <p className={`whitespace-pre-line ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className={`mt-6 h-64 rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
            <div className={`w-full h-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
              <div className="text-center">
                <Globe className={`w-12 h-12 mx-auto mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Interactive Map View</p>
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>LPU, Phagwara, Punjab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;