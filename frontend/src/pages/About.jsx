// frontend/src/pages/About.jsx

import React from "react";

// Import your images
import image1 from "../assets/what.jpg";
import image2 from "../assets/conditions.jpg";
import image3 from "../assets/meeting5.jpg";
import image4 from "../assets/certified.jpg";
import image5 from "../assets/secure.webp";
import image6 from "../assets/started.jpg";

const About = () => {
  return (
    <main className="mx-auto px-4 py-12 text-base">
      
      {/* SECTION 1 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-5">
              What is Pediatric Tele-Dermatology?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Pediatric Tele-Dermatology is a modern, technology-driven healthcare solution that
              allows parents to connect with board-certified pediatric dermatologists without
              visiting a clinic. Using secure digital platforms, parents can upload clear images of
              their child’s skin condition, describe symptoms, and receive expert consultation
              from the comfort of home. This not only reduces travel and waiting time but also ensures
              children receive timely and professional care.
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
            <img src={image2} alt="Pediatric Conditions"
              className="rounded-lg shadow-lg w-[420px] h-[300px] object-cover" />
          </div>

          {/* TEXT RIGHT */}
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-5">Conditions We Treat</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our skilled pediatric dermatologists diagnose and treat a wide range of childhood
              skin conditions including eczema, birthmarks, diaper rash, psoriasis, vitiligo,
              eczema, acne, fungal infections, sunburn reactions, allergies, and various skin
              irritations. Each treatment plan is specially tailored considering the child's age,
              symptoms, skin sensitivity, and medical history, ensuring a safe and effective
              healing process.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-5">Consultation Options</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We offer flexible consultation modes that fit the unique needs of families.
              Parents can attend a fully online consultation from home or schedule assistance
              through a local pediatrician or nurse. Most consultations are allocated within
              48–72 hours—significantly faster than traditional dermatology appointments that
              often require waiting weeks or even months. Parents can choose what works best for them.
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
            <h2 className="text-4xl font-bold text-blue-900 mb-5">Board-Certified Pediatric Dermatologists</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our team consists of highly trained, board-certified pediatric dermatologists who
              specialize exclusively in diagnosing and treating children’s skin conditions. Each
              doctor undergoes rigorous training and certification, ensuring your child receives
              expert-level care. We offer both male and female dermatologists, allowing parents to
              choose based on comfort and preference during the consultation process.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 */}
      <section className="m-4 lg:mx-24 md:mx-12 my-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-5">Accessible, Fast & Secure</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our telehealth platform is designed with advanced security, ensuring your child’s
              medical details and images remain encrypted and protected. No long queues, no travel,
              and no exposure to crowded waiting rooms. Whether using a laptop, a tablet, or a
              mobile phone, families can book appointments, upload medical records, and consult
              securely anytime, from anywhere.
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
            <h2 className="text-4xl font-bold text-blue-900 mb-5">Get Started Today</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Traditional dermatology waitlists can stretch over several months, delaying essential
              treatment for children who may be uncomfortable or in pain. With Pediatric Tele-Dermatology,
              families can access expert help within days—sometimes even on the same day. Start your
              child’s journey toward healthier skin now.
            </p>

            <button className="mt-6 px-6 py-3 bg-blue-700 text-white text-lg rounded hover:scale-105 transition">
              Call Us to Get Started ✆
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
