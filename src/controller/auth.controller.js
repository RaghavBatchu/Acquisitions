import { signUpSchema } from '../validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser } from '../services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const signUp = async (req, res, next) => {
  try {
    const validateResult = signUpSchema.safeParse(req.body);
    if (!validateResult.success) {
      return res.status(409).json({
        error: 'validation error',
        details: formatValidationError(validateResult.error),
      });
    }
    const { name, email, password, role } = validateResult.data;
    const user = await createUser(name, email, role, password);
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info('user successfully registered:${email}');
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('signUp error:', e);

    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }
    next(e);
  }
};
