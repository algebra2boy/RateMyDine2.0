import { Router } from 'express';
import authRoute from '../services/auth/auth.routes.js';
import profileRoute from '../services/profile/profile.routes.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/profile', profileRoute);

export default router;
