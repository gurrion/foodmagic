import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export interface RegisterParams {
  email: string;
  password: string;
  name?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export const register = async (params: RegisterParams) => {
  const { email, password, name } = params;

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Hash del password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      isPremium: true,
      createdAt: true,
    },
  });

  // Generar JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    user,
    token,
  };
};

export const login = async (params: LoginParams) => {
  const { email, password } = params;

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  // Generar JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.isPremium,
      premiumUntil: user.premiumUntil,
    },
    token,
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      isPremium: true,
      premiumUntil: true,
      createdAt: true,
      _count: {
        select: {
          favoriteRecipes: true,
          generatedRecipes: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
};
