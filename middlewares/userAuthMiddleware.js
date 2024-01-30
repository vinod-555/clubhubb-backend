 // authMiddleware.js
import { verifyToken } from '../helpers/userAuthHelper.js';
import User from '../models/userModel.js';

export const requireSignIn =async (req, res, next) => {
  const token = req.headers.authorization;

  

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    req.user=user
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};



