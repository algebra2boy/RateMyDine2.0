import { Router } from 'express';
import authRoute from '../services/auth/auth.routes.js';
import profileRoute from '../services/profile/profile.routes.js';
import reviewRoute from '../services/reviews/reviews.routes.js';
const router = Router();

router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/reviews', reviewRoute);

export default Router().use('/api', router);
