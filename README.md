# 🌴 The Wild Oasis - Custom Backend API

![Node.js](https://img.shields.io/badge/Node.js-20.x-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![License](https://img.shields.io/badge/license-MIT-blue)

> **A robust, production-ready REST API built from scratch to power "The Wild Oasis" hotel management application. Migrated from Supabase to a custom MERN stack architecture.**

## 📖 About The Project

This project represents a significant architectural evolution of the famous "The Wild Oasis" project from **Jonas Schmedtmann's Ultimate React Course**.

Originally built using **Supabase** (Backend-as-a-Service), this repository replaces the entire backend infrastructure with a custom, scalable **Node.js, Express, and MongoDB** solution. It demonstrates the transition from a BaaS prototype to a fully controlled, enterprise-grade backend system.

### 🚀 Key Achievements & Migration Goals
*   **Complete De-coupling**: Removed dependency on Supabase, moving to a self-hosted architecture.
*   **Custom Authentication**: Implemented secure **JWT (JSON Web Keys)** authentication for both Admin Users and Hotel Guests, replacing Supabase Auth. Includes **HttpOnly Cookies** for maximum security.
*   **Data Modeling**: Transformed relational concepts into a flexible **MongoDB/Mongoose** schema with advanced aggregation pipelines.
*   **Storage Migration**: Integrated **Cloudinary** for optimized image storage and delivery, replacing Supabase Buckets.
*   **Security Hardening**: Implemented Helmet, Rate Limiting, Data Sanitization, and HPP (HTTP Parameter Pollution) protection.

---

## 🛠️ Tech Stack

*   **Runtime**: [Node.js](https://nodejs.org/) (v20 LTS)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose ODM](https://mongoosejs.com/)
*   **Authentication**: JWT (Access + Refresh Tokens) + Google OAuth (via Frontend)
*   **File Storage**: [Cloudinary](https://cloudinary.com/) (via Multer)
*   **Documentation**: [Swagger / OpenAPI](https://swagger.io/) (available at `/api-docs`)
*   **Deployment**: [Koyeb](https://www.koyeb.com/) / [Render](https://render.com/)

---

## ✨ Features

### 🔐 Advanced Authentication & Authorization
*   **Dual-Role Support**: Separate authentication flows for Internal Staff (Admin) and Website Guests.
*   **JWT Implementation**: robust logic with short-lived Access Tokens and rotating Refresh Tokens stored in secure HTTP-only cookies.
*   **Social Login**: Integration with Google OAuth flows for guest users.

### 🏨 Hotel Management Core
*   **Cabins API**: CRUD operations for managing hotel cabins, including image uploads and capacity management.
*   **Bookings API**: Complex booking logic to handle dates, overlap checking, pricing calculation, and status updates (Checked-In/Out).
*   **Settings API**: Global hotel settings management (min/max booking length, breakfast price).

### 🛡️ Security & Performance
*   **Rate Limiting**: Protection against brute-force and DDoS attacks.
*   **Data Sanitization**: querying injection protection (NoSQL Injection).
*   **Error Handling**: Global error handling middleware for consistent responses.

---

## 🧭 API Documentation

Full API documentation is available via **Swagger UI** when running the server locally or in production.

*   **Local**: `http://localhost:8000/api-docs`
*   **Live**: `https://the-wild-oasis-backend-zlai.onrender.com/api-docs`

---

## ⚡ Getting Started

### Prerequisites
*   Node.js >= 18
*   MongoDB Atlas Account
*   Cloudinary Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/the-wild-oasis-backend.git
    cd the-wild-oasis-backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    
    # JWT Secrets
    ACCESS_TOKEN_SECRET=your_super_secret_access_key
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
    REFRESH_TOKEN_EXPIRY=7d
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Frontend URLs (CORS)
    FRONTEND_URL=http://localhost:3000
    ADMIN_URL=http://localhost:5173
    ```

4.  **Run the server**
    ```bash
    npm run dev
    ```

---

## 🤝 Related Projects

*   **[The Wild Oasis - Admin Dashboard](https://github.com/yourusername/the-wild-oasis-admin)** - The React Admin interface (Vite)
*   **[The Wild Oasis - Customer Website](https://github.com/yourusername/the-wild-oasis-website)** - The Next.js Guest facing website

---

## 🏷️ Keywords for Discovery
*React Course, Jonas Schmedtmann, The Wild Oasis, Backend Migration, Supabase Alternative, Custom Backend, MERN Stack Project, Node.js Hotel API, MongoDB Booking System, Full Stack Portfolio.*
