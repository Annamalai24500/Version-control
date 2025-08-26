# 📂 Universal Version Control System

A full-stack **Version Control & Repository Management Platform** built with **Node.js, Express, MongoDB, and React**.
This project provides a GitHub-like experience with:

* 🔐 **JWT-based authentication**
* ⚡ **Session-based transactions for APIs** (ensuring atomic and consistent database updates)
* 🎨 **Interactive frontend** for managing repositories, groups, and file versions
* 📦 **Robust version history management** (track, update, and rollback files)

---

## ✨ Features

✅ **Authentication & Authorization**

* Secure **JWT-based authentication**
* Role-based access for groups and repositories

✅ **Repository Management**

* Create, update, delete repositories inside groups
* Store file metadata, count, and storage usage
* Prevent duplicate repository names in a group

✅ **Version Control**

* Track file updates across repository versions
* Automatic version numbering (v1, v2, …)
* Rollback with full version history

✅ **Session-Based Transactions**

* Ensures atomic operations across multiple collections
* Prevents inconsistent states (e.g., repo created without version)
* Implements **MongoDB ACID guarantees**

✅ **Interactive Frontend**

* Modern **React-based UI**
* Repository explorer with versions view
* Seamless API integration with Express backend

---

## 🛠️ Tech Stack

**Frontend:**

* React.js ⚛️
* TailwindCSS 🎨

**Backend:**

* Node.js + Express.js 🚀
* MongoDB + Mongoose 🍃

**Security & Reliability:**

* JWT Authentication 🔐
* Session-based Transactions ⚡

---

## 📸 Videos 
https://drive.google.com/drive/folders/1pmAU5jtLKvh3f8zp4po4ltgN9c1xejYT
Navigate to Version-Control

## ⚙️ API Overview

### 🔹 Repository APIs

* `POST /api/repositories/create-repository/:groupId` → Create a new repository (transactional)
* `GET /api/repositories/get-repositories/:groupId` → List all repositories in a group
* `GET /api/repositories/get-repository/:groupId/:repoId` → Fetch repository details + versions
* `PUT /api/repositories/update-repository/:groupId/:repoId` → Update repository (creates new version)
* `DELETE /api/repositories/delete-repository/:groupId/:repoId` → Delete repository (transactional)

### 🔹 Authentication APIs

* `POST /api/users/register` → Register a new user
* `POST /api/users/login` → Login and receive JWT

---

## 🚀 Getting Started
### 1️⃣ Clone the repo
open VS code
code .(Inside any folder of your choice)
git clone https://github.com/Annamalai24500/Version-control.git
### 2️⃣ Install dependencies
cd server && npm install
cd client && npm install

### 3️⃣ Configure environment variables

Create a `.env` file with:

```
CONNECTION_STRING=mongodb+srv://...
secret_key=your_secret_key
```

### 4️⃣ Run the project

Backend:

cd server
npm run dev

Frontend:

cd client && npm run dev

---

## 📖 Learning Goals

This project was built to strengthen understanding of:

* **ACID Transactions in MongoDB with Mongoose sessions**
* **JWT-based authentication in Express**
* **Full-stack architecture (React + Node + MongoDB)**
* **Version management patterns (similar to Git)**

---

## 🌟 Future Enhancements

* 🔍 Search and filter repositories
* 👥 More granular role-based access

---

## 👨‍💻 Author

Built with ❤️ by R.Annamalai

---

