# Folder Structure

"frontend/src/
│── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── FileUpload.jsx
│   ├── Input.jsx
│   ├── CaseCard.jsx
│
│── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ParentDashboard.jsx
│   ├── SubmitCase.jsx
│   ├── CaseDetails.jsx
│   ├── DoctorLogin.jsx
│   ├── DoctorDashboard.jsx
│   ├── CaseReview.jsx
│
│── services/
│   ├── api.js
│   ├── patientAPI.js
│   ├── doctorAPI.js
│
│── context/
│   └── AuthContext.jsx
│
└── App.jsx 
and 
backend/
│── src/
│   ├── config/
│   │   ├── db.js
│   │   └── multer.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Case.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── caseController.js
│   │   └── doctorController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── caseRoutes.js
│   │   └── doctorRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── app.js
│   └── server.js
│
└── .env
"
