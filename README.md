# 🧒 Pediatric Teledermatology Platform

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) based web application that enables parents to remotely consult pediatric dermatologists by submitting images of their child’s skin conditions for diagnosis and review.

---

## 🚀 Features

### 👨‍👩‍👧 Parent Side
- Register/Login to the platform
- Submit cases with skin issue description and image upload
- Track status of submitted dermatology cases
- View doctor's diagnosis and recommendations

### 🩺 Doctor Side
- Secure login for dermatologists
- View pending patient cases
- Review case details and provide medical notes / treatment guidance
- Update case status (Pending → Reviewed)

### 🗂 Admin
- Manage doctors data
- View analytics and total case counts

---

## 🏗️ Tech Stack

| Layer | Technologies Used |
|-------|------------------|
| **Frontend** | React.js, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js, Multer (image upload), JWT Auth |
| **Database** | MongoDB, Mongoose ORM |
| **Deployment** | Coming Soon |

---

## 📁 Folder Structure

### **Frontend**

```
"frontend/src/
│── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── FileUpload.jsx
│   ├── Input.jsx
│   ├── CaseCard.jsx
|   ├── Logo.jsx
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
|   ├── DoctorList.jsx
│   ├── DoctorDashboard.jsx
│   ├── CaseReview.jsx
|   ├── Messaging.jsx
|   ├── DoctorMessaging.jsx
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
```

---

### **Backend**


```
backend/
│── src/
│   ├── config/
│   │   ├── db.js
│   │   └── multer.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
|   |   ├── Message.js
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
|   |   ├── messageRoutes.js
│   │   └── doctorRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
|   ├── uploads/
│   │   └── cases/
│   │
│   ├── app.js
|   ├── seedDoctor.js
│   └── server.js
|
├── uploads/
│   └── cases/
│
└── .env
```

---

## 🔐 Authentication Flow

- JSON Web Tokens (JWT) used for secure route access
- Separate login portals for Parent and Doctor roles
- Middleware validates token before protected route access

- Parent → Login → JWT Created → Access Dashboard → Submit Case
- Doctor → Login → JWT Created → Access Dashboard → Review Cases


---

## 🩻 Case Submission Workflow
```
Parent Uploads Image + Details
↓
Stored via Multer & Linked to MongoDB
↓
Doctor Reviews Case
↓
Doctor Adds Notes & Marks as Reviewed
↓
Parent Sees Diagnosis Report

```
---

## 🛠️ Installation Steps

### Clone the repository
- git clone https://github.com/SaurabhVishwakarma412/PedoDerma.git


---

## 🎯 Project Status

🚧 **In Progress**  
More features coming soon including:
- Real-time chat with dermatologists
- Appointment scheduling system

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you would like to improve.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Saurabh Vishwakarma**  
B.Tech CSE • Lovely Professional University  
📧 Email: saurabhkv412@gmail.com
🌐 LinkedIn: https://www.linkedin.com/feed/update/urn:li:activity:7408114263015292928/

## 👤 Author
**Aviral  Chaurasia**  
B.Tech CSE • Lovely Professional University
📧 Email: aviralchaurasia175@gmail.com
🌐 LinkedIn: https://www.linkedin.com/in/aviralchaurasia05/

## 👤 Author
**Aditya Khot**  
B.Tech CSE • Lovely Professional University  
📧 Email: khot.aditya7618@gmail.com
🌐 LinkedIn: https://www.linkedin.com/feed/update/urn:li:activity:7408558428039680000/

---

> *Pediatric Teledermatology aims to bridge the gap between healthcare and accessibility by enabling early skin condition detection for children, anytime and anywhere.*

---

🌟 **Star this repo** if you like the project!  

