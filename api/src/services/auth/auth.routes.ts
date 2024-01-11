import express from 'express';
import * as authContoller from './auth.controller.js';

import { ZodMiddleware } from '../../middlewares/ZodValidation.js';
import { SignUpSchema } from '../../validations/authValidation.js';

const router = express.Router();

router.post('/signup', ZodMiddleware(SignUpSchema), authContoller.signUp);

export default router;
