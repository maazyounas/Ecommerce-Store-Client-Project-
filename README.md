# Daraz E-Commerce Replica

A full-stack e-commerce application built with Vue.js and Node.js, replicating core features of Daraz.

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Installation Guide

### Step 1: Extract/Clone the Project

If you received a ZIP file:
```bash
# Extract the ZIP file to a folder
# Open terminal/command prompt in that folder
```

### Step 2: Database Setup

1. **Start MySQL Server**
   - Open MySQL Workbench or MySQL Command Line

2. **Create Database**
   ```sql
   CREATE DATABASE myStore;
   USE myStore;
   ```

3. **Import Database Schema**

   **Option 1: Using MySQL Workbench**
   - Open MySQL Workbench
   - Connect to your MySQL server
   - Go to `File` → `Run SQL Script`
   - Select `schema.sql` from the project root folder
   - Click `Run`

   **Option 2: Using MySQL Command Line**
   ```bash
   mysql -u root -p myStore < schema.sql
   ```
   
   **Option 3: Copy and Paste**
   - Open `schema.sql` file in the project root
   - Copy all content
   - Paste into MySQL Workbench or MySQL Command Line
   - Execute

   This will create all necessary tables:
   - `users` - User accounts and authentication
   - `categories` - Product categories with subcategory support
   - `products` - Product catalog
   - `product_images` - Multiple images per product
   - `cart` - Shopping cart items
   - `orders` - Order records
   - `order_items` - Items in each order
   - `payments` - Payment transactions
   - `returns` - Return requests
   - `reviews` - Product reviews and ratings
   - `review_images` - Review images
   - `questions` - Product Q&A
   - `coupons` - Discount codes
   - `hero_sections` - Homepage banners
   - `inquiries` - Contact form messages

### Step 3: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in backend folder
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=myStore
   JWT_SECRET=your_secret_key_here_change_this_in_production
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Important:** Replace `your_mysql_password` with your actual MySQL password

4. **Start backend server**
   ```bash
   npm run dev
   ```

   You should see: `Server is running on port 5000` and `MySQL Connected`

### Step 4: Frontend Setup

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend folder**
   ```bash
   cd myStore
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

   You should see: `Local: http://localhost:5173/`

### Step 5: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`
2. **Backend API** runs on: `http://localhost:5000`

## 🎯 Default Admin Access

To create an admin user, insert directly into database:

```sql
-- Password: admin123 (hashed)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@daraz.com', '$2a$10$example_hashed_password', 'admin');
```

Or register normally and update role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## 📁 Project Structure

```
daraz replica/
│├── schema.sql              # Database schema (all tables)
├── README.md               # This file
│├── backend/                 # Node.js Backend
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── db.js           # MySQL connection
│   ├── controllers/        # Business logic
│   ├── middlewares/        # Auth & admin middlewares
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads
│   └── package.json
│
└── myStore/                # Vue.js Frontend
    ├── index.html
    ├── src/
    │   ├── App.vue
    │   ├── main.js
    │   ├── components/
    │   │   ├── admin/      # Admin panel components
    │   │   ├── home/       # Home page components
    │   │   ├── basket/     # Cart components
    │   │   ├── checkout/   # Checkout components
    │   │   ├── myProfile/  # User profile components
    │   │   └── products/   # Product components
    │   ├── router/
    │   │   └── routing.js  # Vue Router config
    │   └── utils/
    │       └── cloudinary.js
    └── package.json
```

## ✨ Features

### Customer Features
- ✅ User Registration & Login
- ✅ Browse Products by Category
- ✅ Product Search & Filter
- ✅ Add to Cart
- ✅ Checkout with Cash on Delivery
- ✅ Order History
- ✅ Product Reviews & Ratings
- ✅ Return Requests
- ✅ User Profile Management
- ✅ Wishlist

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ Product Management (Add/Edit/Delete)
- ✅ Category Management (with Subcategories)
- ✅ Order Management
- ✅ User Management
- ✅ Review Management
- ✅ Return Request Management

## 🛠️ Technologies Used

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Axios
- Vue3-Toastify (Notifications)
- Quill Editor (Rich Text)
- Vite (Build Tool)

### Backend
- Node.js
- Express.js
- MySQL (with mysql2/promise)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Cloudinary (Image Hosting)
- Cookie Parser
- CORS

## 🔧 Common Issues & Solutions

### Issue 1: MySQL Connection Failed
**Solution:** Check if MySQL server is running and credentials in `.env` are correct

### Issue 2: Port Already in Use
**Solution:** 
```bash
# For port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# For port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Issue 3: npm install fails
**Solution:** 
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### Issue 4: Images not uploading
**Solution:** Configure Cloudinary credentials in `.env` file
- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your credentials from dashboard

## 📝 Important Notes

1. **Never share your `.env` file** - It contains sensitive information
2. **Change JWT_SECRET** before deployment
3. **Keep both terminals running** - One for backend, one for frontend
4. **Database must be created** before running the application
5. **Node modules are large** - Don't copy them, run `npm install` instead

## 🚀 Production Deployment

### Free Deployment Guide

Deploy your project completely free using these platforms:

#### 1. Database - Aiven MySQL (Free Tier)

1. **Sign up at [Aiven](https://aiven.io/)**
   - Create free account
   - No credit card required

2. **Create MySQL Database**
   - Click "Create Service"
   - Select "MySQL"
   - Choose "Free" plan (1 CPU, 1GB RAM)
   - Select region closest to you
   - Click "Create Service"

3. **Get Connection Details**
   - Wait for service to start (2-3 minutes)
   - Go to "Overview" tab
   - Note down:
     - Host
     - Port
     - User
     - Password
     - Database name

4. **Import Schema**
   - Download CA Certificate from Aiven dashboard
   - Connect using MySQL Workbench or command line:
   ```bash
   mysql -h <host> -P <port> -u <user> -p --ssl-ca=ca.pem < schema.sql
   ```

#### 2. Backend - Render (Free Tier)

1. **Sign up at [Render](https://render.com)**
   - Use GitHub to sign up

2. **Push Code to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/daraz-backend.git
   git push -u origin main
   ```

3. **Create Web Service on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `daraz-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start` (or `node server.js`)
     - Instance Type: `Free`

4. **Add Environment Variables**
   In Render dashboard, add these environment variables:
   ```
   PORT=10000
   DB_HOST=<aiven-host>
   DB_PORT=<aiven-port>
   DB_USER=<aiven-user>
   DB_PASSWORD=<aiven-password>
   DB_NAME=<aiven-database>
   JWT_SECRET=your_long_random_secret_key_here
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   NODE_ENV=production
   ```

5. **Update CORS in backend/app.js**
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-url.vercel.app'],
     credentials: true
   }));
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Your backend URL: `https://daraz-backend.onrender.com`

#### 3. Frontend - Vercel (Free Tier)

1. **Update API Base URL**
   
   Create `myStore/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

   Update `myStore/src/components/axios/Axios.js`:
   ```javascript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
     withCredentials: true
   });
   ```

2. **Build the Project**
   ```bash
   cd myStore
   npm run build
   ```

3. **Sign up at [Vercel](https://vercel.com)**
   - Use GitHub to sign up

4. **Push Frontend to GitHub**
   ```bash
   cd myStore
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/daraz-frontend.git
   git push -u origin main
   ```

5. **Deploy on Vercel**
   - Click "Add New" → "Project"
   - Import your frontend repository
   - Configure:
     - Framework Preset: `Vite`
     - Root Directory: `./` (or leave empty)
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
   - Click "Deploy"

6. **Get Your URL**
   - After deployment: `https://your-project.vercel.app`

### Alternative Free Platforms

#### Database Alternatives:
- **PlanetScale** - Free MySQL with 5GB storage
- **FreeSQLDatabase** - Free MySQL hosting
- **Railway** - Free tier with 500 hours/month

#### Backend Alternatives:
- **Railway** - 500 hours/month free
- **Fly.io** - Free tier available
- **Cyclic** - Unlimited free deployments

#### Frontend Alternatives:
- **Netlify** - Similar to Vercel, free tier
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Free unlimited sites

### Important Notes for Free Deployment

1. **Render Free Tier Limitations:**
   - Service sleeps after 15 min of inactivity
   - First request after sleep takes 30-60 seconds
   - 750 hours/month free

2. **Aiven Free Tier:**
   - Limited to 1 service
   - Automatically backs up daily
   - 1GB storage limit

3. **Vercel Free Tier:**
   - 100GB bandwidth/month
   - Unlimited deployments
   - Automatic HTTPS

### Keep Your Free Services Active

Create a simple cron job or use [UptimeRobot](https://uptimerobot.com/) to ping your backend every 10 minutes:
- Prevents Render from sleeping
- Free monitoring service

### Complete Deployment Checklist

- [ ] Database created on Aiven
- [ ] Schema imported to Aiven database
- [ ] Backend code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Environment variables set on Render
- [ ] CORS updated with frontend URL
- [ ] Frontend .env.production created
- [ ] Axios baseURL updated
- [ ] Frontend code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Admin user created in database
- [ ] Test complete user flow (register, login, order)
- [ ] Test admin panel access

### Post-Deployment

1. **Create Admin User:**
   Connect to Aiven database and run:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

2. **Test Everything:**
   - User registration and login
   - Product browsing
   - Add to cart
   - Checkout process
   - Admin panel access
   - Product management
   - Order management

3. **Monitor Your App:**
   - Render: Check logs for errors
   - Vercel: Check deployment logs
   - Aiven: Monitor database performance

### Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| Aiven MySQL | **FREE** | 1GB storage, 1 service |
| Render Backend | **FREE** | 750 hours/month, sleeps after 15min |
| Vercel Frontend | **FREE** | 100GB bandwidth, unlimited deploys |
| **TOTAL** | **$0/month** | Perfect for portfolio projects |

### Need Better Performance?

If your project grows, upgrade to paid plans:
- **Render Pro**: $7/month (no sleep, better performance)
- **Aiven Startup**: $9/month (2GB storage, better specs)
- **Vercel Pro**: $20/month (better bandwidth & features)

---

## 🎓 Deployment Tutorial Video

For step-by-step video tutorial, check:
- Render deployment: [YouTube Tutorial](https://www.youtube.com/results?search_query=render+nodejs+deployment)
- Vercel deployment: [YouTube Tutorial](https://www.youtube.com/results?search_query=vercel+vue+deployment)

---

## 🎥 Show to Recruiters Without Deployment

If you want to showcase your project to recruiters without deploying, here are several options:

### Option 1: Screen Recording Demo (Recommended)

**Create a professional demo video:**

1. **Use Free Screen Recording Tools:**
   - **OBS Studio** (Windows/Mac) - [Download](https://obsproject.com/)
   - **Loom** (Browser-based) - [loom.com](https://loom.com) - Free 5min videos
   - **ShareX** (Windows) - [Download](https://getsharex.com/)
   - **QuickTime** (Mac) - Built-in

2. **What to Record (5-10 minutes):**
   ```
   📹 Demo Script:
   
   ✅ Introduction (30 sec)
      - "This is a full-stack e-commerce platform built with Vue.js and Node.js"
   
   ✅ User Features (3 min)
      - Homepage with categories and products
      - Product detail page with reviews
      - Add to cart functionality
      - Checkout process with COD
      - User profile and order history
      - Return request feature
   
   ✅ Admin Panel (3 min)
      - Login as admin
      - Dashboard with statistics
      - Add/Edit products with images
      - Category management with subcategories
      - Order management (status updates)
      - Review management
   
   ✅ Technical Highlights (1 min)
      - Show code structure in VS Code
      - Mention: Vue 3, Node.js, MySQL, JWT auth
      - Show responsive design (resize browser)
   
   ✅ Conclusion (30 sec)
      - GitHub repository link
      - Thank you
   ```

3. **Upload Video:**
   - **YouTube** (Unlisted) - Share link only
   - **Google Drive** - Share with link
   - **Loom** - Direct shareable link

4. **Add to Resume/Portfolio:**
   ```
   E-Commerce Platform (Vue.js, Node.js, MySQL)
   🎥 Live Demo: [Video Link]
   💻 GitHub: [Repository Link]
   📄 Documentation: [README Link]
   ```

### Option 2: Localhost with ngrok (Live Demo)

**Give recruiters temporary live access:**

1. **Install ngrok** - [Download](https://ngrok.com/download)
   ```bash
   # Windows
   choco install ngrok
   
   # Or download from website
   ```

2. **Start Your Servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd myStore
   npm run dev
   ```

3. **Create Public URL:**
   ```bash
   # Terminal 3 - Expose backend
   ngrok http 5000
   # Copy the https URL (e.g., https://abc123.ngrok.io)
   
   # Terminal 4 - Expose frontend
   ngrok http 5173
   # Copy the https URL
   ```

4. **Share with Recruiter:**
   - Send both URLs via email
   - Available for 8 hours (free tier)
   - Can schedule demo call

**⚠️ Important:** Stop ngrok after the demo for security

### Option 3: Local Setup Guide for Recruiter

**Provide easy-to-follow instructions:**

Create a `DEMO_SETUP.md` file:

```markdown
# Quick Demo Setup (5 minutes)

## Prerequisites
- Node.js installed
- MySQL installed

## Setup Steps

1. Extract the project folder
2. Import database:
   ```bash
   mysql -u root -p < schema.sql
   ```

3. Backend:
   ```bash
   cd backend
   npm install
   # Edit .env file with your MySQL password
   npm run dev
   ```

4. Frontend (new terminal):
   ```bash
   cd myStore
   npm install
   npm run dev
   ```

5. Open: http://localhost:5173

## Demo Accounts
- Customer: demo@customer.com / password123
- Admin: demo@admin.com / admin123
```

### Option 4: Record Animated GIFs

**Show key features with GIFs:**

1. **Use Tools:**
   - **ScreenToGif** (Windows) - [screentogif.com](https://www.screentogif.com/)
   - **Gifox** (Mac) - [gifox.io](https://gifox.io/)
   - **Peek** (Linux) - [github.com/phw/peek](https://github.com/phw/peek)

2. **Create GIFs for:**
   - User registration/login
   - Product browsing and cart
   - Checkout process
   - Admin dashboard
   - Product management

3. **Add to README.md:**
   ```markdown
   ## 📸 Features Preview
   
   ### Customer Flow
   ![Shopping Demo](demos/shopping.gif)
   
   ### Admin Panel
   ![Admin Demo](demos/admin.gif)
   ```

### Option 5: Presentation Slides

**Create a PowerPoint/Google Slides presentation:**

```
Slide 1: Title
- Project Name: Daraz E-Commerce Replica
- Your Name & Contact
- Tech Stack: Vue.js, Node.js, MySQL

Slide 2: Project Overview
- Full-stack e-commerce platform
- Customer & Admin features
- Real-world functionality

Slide 3-8: Screenshots with annotations
- Homepage
- Product Details
- Shopping Cart
- Admin Dashboard
- Order Management
- Category Management

Slide 9: Technical Implementation
- Frontend: Vue 3, Vue Router, Axios
- Backend: Express.js, JWT Auth
- Database: MySQL with 15+ tables
- Features: Authentication, Authorization, CRUD

Slide 10: Code Highlights (screenshots)
- Show clean code structure
- API endpoints
- Database schema

Slide 11: Challenges & Solutions
- Implemented hierarchical categories
- Order management system
- Image upload to Cloudinary

Slide 12: Future Enhancements
- Payment gateway integration
- Email notifications
- Advanced search & filters

Slide 13: Links
- 🎥 Video Demo: [link]
- 💻 GitHub: [link]
- 📧 Contact: [email]
```

### Option 6: GitHub Portfolio

**Make your GitHub repository showcase-ready:**

1. **Add Screenshots to Repository:**
   ```bash
   mkdir screenshots
   # Add screenshots of key features
   ```

2. **Enhanced README with Images:**
   ```markdown
   ## 📸 Screenshots
   
   ### Homepage
   ![Homepage](screenshots/homepage.png)
   
   ### Admin Dashboard
   ![Admin](screenshots/admin.png)
   ```

3. **Add Badges:**
   ```markdown
   ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
   ![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
   ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
   ```

4. **Pin Repository** on your GitHub profile

### Best Combination for Job Applications

**Recommended approach:**

```
1. 🎥 5-minute demo video (YouTube/Loom)
2. 📁 Clean GitHub repository with screenshots
3. 📄 Professional README with setup instructions
4. 💼 Add to portfolio website/LinkedIn

In your email/application:
"I've built a full-stack e-commerce platform demonstrating:
- 🎥 Video Demo: [link] (5 min walkthrough)
- 💻 Source Code: [GitHub link]
- 📋 Features: User authentication, shopping cart, admin panel
- 🛠️ Tech Stack: Vue.js, Node.js, MySQL"
```

### Tools Summary

| Purpose | Free Tool | Link |
|---------|-----------|------|
| Screen Recording | OBS Studio / Loom | obsproject.com / loom.com |
| GIF Recording | ScreenToGif | screentogif.com |
| Temporary Public URL | ngrok | ngrok.com |
| Video Hosting | YouTube (Unlisted) | youtube.com |
| Slides | Google Slides | slides.google.com |
| Code Hosting | GitHub | github.com |

---

## 📞 Support

If you face any issues:
1. Check if MySQL is running
2. Verify `.env` configuration
3. Make sure both servers are running
4. Check browser console for errors
5. Check backend terminal for error logs

