import express from 'express';
import { signUp } from '../controller/auth.controller.js';

const router = express.Router();

// Example route for user authentication
router.post('/sign-up',signUp);

router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in');
});

router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out');
});

export default router;
