// authRoutes.js
import express from 'express';
import { signup, signin } from '../controllers/userAuthController.js';
import { requireSignIn } from '../middlewares/userAuthMiddleware.js';
import { forgotPasswordController } from '../controllers/forgotPasswordController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);



// Example protected route
router.get('/protected', requireSignIn, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// forgot password
router.post('/forgot-password',forgotPasswordController)

router.post("/verify-otp", verifyOtpController);

router.post("/reset-password", resetPasswordController);


export default router;


