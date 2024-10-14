import jwt from 'jsonwebtoken';
import UserModel from '../../model/UserProfile.js'
import config from '../config/envConfig.js';

export const authenticateToken = async (req, res, next) => {
  let token = req.headers.authorization;
  

  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: 'Authentication failed. No token provided.' });
  }

  token = token.slice(7); 
  
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    req.decoded = decoded;
    const userId = req.decoded.id;
 
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return res.status(403).json({ message: 'Authentication failed. User not authorized.' });
    }

    // Attach the user details to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
  }
};
