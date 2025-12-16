// frontend/src/pages/DoctorsList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../services/patientAPI";
import { Star, MapPin, Calendar, Clock, Award, CheckCircle } from "lucide-react";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    availability: "",
    rating: ""
  });

  const specialties = [
    "Pediatric Dermatology",
    "General Dermatology",
    "Pediatric Eczema Specialist",
    "Acne Specialist",
    "Birthmark & Mole Specialist",
    "Allergy & Immunology"
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    if (filters.specialty && doctor.specialty !== filters.specialty) return false;
    if (filters.availability && !doctor.availability.includes(filters.availability)) return false;
    if (filters.rating && doctor.rating < parseFloat(filters.rating)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Pediatric Dermatologists</h1>
          <p className="text-gray-600">Board-certified specialists ready to help your child</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Specialties</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ stars</option>
                <option value="4.0">4.0+ stars</option>
                <option value="3.5">3.5+ stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No doctors found matching your filters.</p>
            <button
              onClick={() => setFilters({ specialty: "", availability: "", rating: "" })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Doctor Card Header */}
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Doctor Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                        {doctor.name?.charAt(0) || "D"}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(doctor.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {doctor.rating || "4.5"} ({doctor.reviewCount || "120"} reviews)
                        </span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Award className="w-4 h-4 mr-1" />
                        <span>{doctor.experience || "10+ years"} experience</span>
                      </div>

                      {/* Location */}
                      {doctor.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{doctor.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Board Certified • Verified</span>
                  </div>

                  {/* Availability */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Next available:</span>
                      </div>
                      <span className="font-semibold">{doctor.nextAvailable || "Today"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Actions */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-800">
                        ${doctor.consultationFee || "99"}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/consultation</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/doctors/${doctor.id}`}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/book-online?doctor=${doctor.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Our Pediatric Dermatologists?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Board Certified</h4>
              <p className="text-sm text-gray-600">All doctors are certified pediatric dermatologists</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">24/7 Access</h4>
              <p className="text-sm text-gray-600">Consult from home at your convenience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Free Follow-up</h4>
              <p className="text-sm text-gray-600">7-day free follow-up included with every consultation</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Can't find the right doctor?</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Contact Our Support Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;