import express from 'express';
import { register, login, getProfile, verifyToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', authMiddleware, getProfile);
router.get('/verify', authMiddleware, verifyToken);

export default router;
