import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

/*
 * Create the first admin account automatically.
 * Password is stored as a bcrypt hash in MongoDB.
 */
export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      'ADMIN_EMAIL or ADMIN_PASSWORD is missing.'
    );
    return;
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await Admin.create({
    email,
    password: hashedPassword,
    name: 'Support Admin',
    role: 'admin'
  });

  console.log(`Admin account created for ${email}`);
}


/*
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim()
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
});


/*
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

export default router;