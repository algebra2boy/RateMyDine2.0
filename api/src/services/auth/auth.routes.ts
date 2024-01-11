import express from 'express';
import * as authContoller from './auth.controller.js';

import { ZodMiddleware } from '../../middlewares/ZodValidation.js';
import { LoginSchema, SignUpSchema } from '../../validations/authValidation.js';

const router = express.Router();

router.post('/login', ZodMiddleware(LoginSchema), authContoller.login);
router.post('/signup', ZodMiddleware(SignUpSchema), authContoller.signUp);

export default router;
