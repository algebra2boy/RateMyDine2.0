import express from 'express';
import * as authContoller from './auth.controller.js';

import ZodMW from '../../middlewares/ZodValidation.mw.js';
import { LoginSchema, SignUpSchema } from '../../validations/auth.validation.js';

const router = express.Router();

router.post('/login', ZodMW(LoginSchema), authContoller.login);
router.post('/signup', ZodMW(SignUpSchema), authContoller.signUp);

export default router;
