import express from 'express';
import upload from '../../utils/multer.js';
import { getUserProfile, login, register, verifyEmail } from './controller.js';
import {authenticateToken} from '../../common/Jwt/middleware.js';
import { validator } from '../../common/validator/expressValidator.js';

const router = express.Router();

// Register Route with profile picture upload
router.post('/register', upload.single('profilePicture'), validator("register"), register);
router.post('/verifyEmail', validator("verifyEmail"), verifyEmail);
router.post('/login', validator('login'), login);
router.get('/getUserProfile', authenticateToken, getUserProfile)

export default router;
