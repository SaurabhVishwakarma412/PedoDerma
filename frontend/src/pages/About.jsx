// frontend/src/pages/About.jsx

import React from "react";
import { Link } from "react-router-dom";

// Import your images
import image1 from "../assets/what.jpg";
import image2 from "../assets/conditions.jpg";
import image3 from "../assets/meeting5.jpg";
import image4 from "../assets/certified.jpg";
import image5 from "../assets/secure.webp";
import image6 from "../assets/started.jpg";

const About = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  return (
    <main className={`min-h-screen mx-auto px-4 py-12 text-base transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white"}`}>
      
      {/* SECTION 1 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div>
            <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-blue-300" : "text-blue-900"}`}>
              What is Tele-Dermatology?
            </h2>
            <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Dermaslot is a dermatology-focused case platform for concerns that are visible,
              uncomfortable, or changing. Upload photographs of the affected area, record symptoms
              such as itch, pain, scaling, or discharge, and build a clearer clinical picture before
              a consultation. It supports informed next steps and does not replace emergency care.
            </p>
          </div>

          {/* IMAGE RIGHT */}
          <div className="flex justify-center">
            <img src={image1} alt="Tele Dermatology"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* IMAGE LEFT */}
          <div className="flex justify-center">
            <img src={image2} alt="Dermatology Conditions"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>

          {/* TEXT RIGHT */}
          <div>
            <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-blue-300" : "text-blue-900"}`}>Conditions We Treat</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Dermaslot cases can describe eczema and atopic dermatitis, acne and folliculitis,
              psoriasis, vitiligo, contact reactions, fungal infections, hives, recurring rashes,
              and new or changing lesions. Record where it appears, when it began, how it has changed,
              possible triggers, and treatments already tried.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div>
            <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-blue-300" : "text-blue-900"}`}>Consultation Options</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              We offer flexible consultation modes that fit your unique needs.
              Patients can attend a fully online consultation from home or schedule an
              in-person visit. Most consultations are confirmed within
              48–72 hours—significantly faster than traditional dermatology appointments that
              often require waiting weeks or even months. Choose the option that works best for you.
            </p>
          </div>

          {/* IMAGE RIGHT */}
          <div className="flex justify-center">
            <img src={image3} alt="Consultation"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* IMAGE LEFT */}
          <div className="flex justify-center">
            <img src={image4} alt="Certified Doctors"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>

          {/* TEXT RIGHT */}
          <div>
            <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-blue-300" : "text-blue-900"}`}>Dermatology Review Context</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Dermatology reviews depend on good context. Dermaslot gives clinicians a chronological
              record of symptoms and images, helping them assess pattern, distribution, severity, and
              response to earlier care. Provider credentials and availability are presented in the
              doctor directory for each user to review.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div>
            <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-blue-300" : "text-blue-900"}`}>Accessible, Fast & Secure</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Your case connects photos, health details, messages, appointment notes, and follow-up
              guidance in one account. Use a phone or computer to add updates when a flare changes,
              a new area is involved, or a treatment causes a reaction.
            </p>
          </div>

          {/* IMAGE RIGHT */}
          <div className="flex justify-center">
            <img src={image5} alt="Secure Access"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>
        </div>
      </section>

      {/* SECTION 6 */}
      <section className="m-4 lg:mx-24 md:mx-12 mb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* IMAGE LEFT */}
          <div className="flex justify-center">
            <img src={image6} alt="Book Now"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>

          {/* TEXT RIGHT */}
          <div>
            <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-blue-300" : "text-blue-900"}`}>Get Started Today</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Traditional dermatology waitlists can stretch over several months, delaying essential
              treatment for patients who need timely care. With Dermaslot,
              you can access expert help within days—sometimes even on the same day. Start your
              journey toward healthier skin now.
            </p>

            <Link
              to="/contact"
              className="inline-block mt-6 px-6 py-3 bg-blue-700 text-white text-lg rounded hover:scale-105 transition"
            >
              Contact Us to Get Started ✆
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
