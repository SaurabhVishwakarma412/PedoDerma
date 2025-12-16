import React, { useState } from 'react'
import { Calendar, Clock, User, Phone, MessageSquare, Camera } from 'lucide-react'

const BookOnline = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    parentName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    symptoms: '',
    skinCondition: '',
    urgency: 'routine',
    preferredDoctor: '',
    photos: []
  })

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const skinConditions = [
    'Eczema/Dermatitis',
    'Acne',
    'Rashes',
    'Birthmarks/Moles',
    'Psoriasis',
    'Viral Infections',
    'Allergic Reactions',
    'Warts',
    'Hair/Scalp Issues',
    'Other'
  ]

  const doctors = [
    { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'Pediatric Dermatology', experience: '15 years' },
    { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'Pediatric Eczema Specialist', experience: '12 years' },
    { id: 'dr3', name: 'Dr. Priya Sharma', specialty: 'Infant Skin Care', experience: '10 years' },
    { id: 'dr4', name: 'Dr. Robert Kim', specialty: 'Teen Dermatology', experience: '8 years' },
    { id: 'dr5', name: 'Dr. Ananya Patel', specialty: 'General Pediatric Dermatology', experience: '14 years' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }))
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Appointment booked:', formData)
    alert('Appointment request submitted successfully! Our team will contact you shortly.')
    // Reset form
    setFormData({
      patientName: '',
      patientAge: '',
      parentName: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      symptoms: '',
      skinCondition: '',
      urgency: 'routine',
      preferredDoctor: '',
      photos: []
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Book Pediatric Dermatology Appointment</h1>
          <p className="text-gray-600">Schedule an online consultation with our board-certified pediatric dermatologists</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Appointment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Calendar className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Appointment Details</h2>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Patient Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child's Full Name *
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter child's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child's Age *
                      </label>
                      <input
                        type="number"
                        name="patientAge"
                        value={formData.patientAge}
                        onChange={handleChange}
                        required
                        min="0"
                        max="18"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Age in years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent/Guardian Name *
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent's Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Appointment Timing */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    Select Date & Time
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time *
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-600" />
                    Medical Details
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Skin Condition *
                    </label>
                    <select
                      name="skinCondition"
                      value={formData.skinCondition}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select condition</option>
                      {skinConditions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symptoms Description *
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Describe symptoms, duration, any treatments tried, and other relevant details..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency Level
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { value: 'routine', label: 'Routine', desc: 'Non-urgent, can wait' },
                        { value: 'soon', label: 'Soon', desc: 'Within a week' },
                        { value: 'urgent', label: 'Urgent', desc: 'Within 24-48 hours' }
                      ].map((urgency) => (
                        <label key={urgency.value} className="flex items-center">
                          <input
                            type="radio"
                            name="urgency"
                            value={urgency.value}
                            checked={formData.urgency === urgency.value}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <div>
                            <span className="font-medium">{urgency.label}</span>
                            <p className="text-xs text-gray-500">{urgency.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <Camera size={18} className="text-blue-600" />
                    Upload Photos (Optional but Recommended)
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-flex flex-col items-center"
                    >
                      <Camera className="text-gray-400 mb-2" size={32} />
                      <span className="text-blue-600 font-medium">Click to upload photos</span>
                      <span className="text-sm text-gray-500 mt-1">
                        Upload clear photos of the affected area from different angles
                      </span>
                    </label>
                  </div>
                  
                  {formData.photos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Photos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-sm text-gray-500">Photo {index + 1}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Doctor Selection & Info */}
          <div className="space-y-6">
            {/* Doctor Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select Preferred Doctor</h3>
              <select
                name="preferredDoctor"
                value={formData.preferredDoctor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition mb-4"
              >
                <option value="">Any Available Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Available Doctors:</h4>
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 border rounded-lg hover:border-blue-400 transition cursor-pointer">
                    <div className="font-medium text-gray-800">{doctor.name}</div>
                    <div className="text-sm text-gray-600">{doctor.specialty}</div>
                    <div className="text-xs text-gray-500 mt-1">{doctor.experience} experience</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Summary */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Appointment Summary</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="text-gray-700">Online Video Consultation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-blue-600" />
                  <span className="text-gray-700">Duration: 15-30 minutes</span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-blue-600" />
                  <span className="text-gray-700">Free 7-day follow-up</span>
                </li>
                <li className="flex items-center gap-3">
                  <User size={16} className="text-blue-600" />
                  <span className="text-gray-700">Board-certified pediatric dermatologists</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-900">Total Cost</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">$99</div>
                    <div className="text-sm text-gray-600">Insurance may cover</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Call us at</div>
                    <div className="font-medium text-blue-600">1-800-PED-SKIN</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Our support team is available 9 AM - 8 PM EST, 7 days a week
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By booking an appointment, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="mt-1">Cancellation can be made up to 24 hours before the appointment without charge.</p>
        </div>
      </div>
    </div>
  )
}

export default BookOnline