import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/mailer.js';
import { hashSync } from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    await db.query(insertQuery, [name, email, hashedPassword]);

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login (JWT in Cookie)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("login controller:",email, password);

    const findUser = `SELECT * FROM users WHERE email = ?`;
    const [results] = await db.query(findUser, [email]); // ✅ Use await and parameterized query

    if (!results || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Logout
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// ✅ Get Profile
export const getUserProfile = async (req, res) => {
  console.log("User profile route hit");

  try {
    const userId = req.user.id;
    console.log("User ID:", userId);

    const query = `
      SELECT name, email, phone, address, gender ,dob
      FROM users 
      WHERE id = ?
    `;

    const [results] = await db.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User profile data:", results[0]);
    return res.status(200).json(results[0]);

  } catch (error) {
    console.error("Get Profile Error:", error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// ✅ Update Profile
// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      phone,
      email,
      gender,
      dob,
      address
    } = req.body;
    const safeDob = dob && dob.trim() !== '' ? dob : null;

    const query = `
      UPDATE users 
      SET name = ?, phone = ?, email = ?, gender = ?, dob = ?, address = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, [fullName, phone, email, gender, safeDob, address, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};




// ✅ Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect old password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, userId]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email, "forgot password ccontroller working");
  if (!email) return res.status(400).json({ message: "Email is required" });

  const token = crypto.randomBytes(8).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  try {
    const [result] = await db.execute(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    await sendResetEmail(email, token);
    res.json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to process request", error: err.message });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password required" });
  }

  try {
    const [result] = await db.execute(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = hashSync(password, 10);
    await db.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, result[0].id]
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};





// ✅ Total Users Controller
export const getTotalUsers = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT COUNT(*) AS totalUsers FROM users`);
    const totalUsers = result[0].totalUsers;
    res.status(200).json({ totalUsers });
  } catch (err) {
    console.error("Error fetching total users:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// controllers/user.controller.js


export const getUserAddress = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }

    const [rows] = await db.execute(
      `SELECT address FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ address: rows[0].address });
  } catch (error) {
    console.error("Error fetching user address:", error);
    res.status(500).json({ message: "Server error" });
  }
};


