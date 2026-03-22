import { Router } from 'express';
import { registerController, loginController, getProfileController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Público
router.post('/register', registerController);
router.post('/login', loginController);

// Protegido
router.get('/profile', authMiddleware, getProfileController);

export default router;
