// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import orderItemRoutes from './routes/orderItem.routes.js';
import reviewRoutes from './routes/review.routes.js';
import heroRoutes from './routes/hero.routes.js';
import productImageRoutes from './routes/productImage.routes.js';
import returnRoutes from './routes/return.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import cartRoutes from './routes/cart.routes.js';
import authRoutes from './routes/auth.routes.js';

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/reviews", reviewRoutes);//this
app.use("/api/heroes", heroRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/auth",authRoutes );

export default app;
