import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare passwords
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId, email, userType) => {
  return jwt.sign(
    {
      userId,
      email,
      userType
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY || '7d'
    }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
