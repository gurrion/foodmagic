import { Request, Response } from 'express';
import { register, login, getProfile } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { AuthRequest } from '../middleware/auth';

export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await register(validatedData);

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Error al registrar usuario',
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await login(validatedData);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(401).json({
      success: false,
      error: error.message || 'Error al iniciar sesión',
    });
  }
};

export const getProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const profile = await getProfile(userId);

    res.status(200).json({
      success: true,
      ...profile,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message || 'Error al obtener perfil',
    });
  }
};
